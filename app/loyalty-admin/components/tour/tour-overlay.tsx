'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Minimize2, HelpCircle } from 'lucide-react';
import { useTour } from './tour-context';

// ============================================
// Types
// ============================================
interface TooltipPosition {
    top: number;
    left: number;
    arrowPosition: 'top' | 'right' | 'bottom' | 'left';
}

interface TargetRect {
    top: number;
    left: number;
    width: number;
    height: number;
}

// ============================================
// Constants
// ============================================
const TOOLTIP_OFFSET = 16;
const ARROW_SIZE = 8;
const RETRY_INTERVAL = 200;
const MAX_RETRIES = 10;

// ============================================
// Tour Overlay Component
// ============================================
export function TourOverlay() {
    const {
        isActive,
        isCollapsed,
        currentStep,
        currentStepIndex,
        totalSteps,
        nextStep,
        prevStep,
        skipTour,
        collapse,
        resume,
    } = useTour();

    const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    const tooltipRef = useRef<HTMLDivElement>(null);

    // Find target element and calculate positions
    const findAndPositionTarget = useCallback(() => {
        if (!currentStep) return false;

        const target = document.querySelector(currentStep.targetSelector);
        if (!target) return false;

        const rect = target.getBoundingClientRect();
        setTargetRect({
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height,
        });

        // Calculate tooltip position
        const tooltipWidth = tooltipRef.current?.offsetWidth || 320;
        const tooltipHeight = tooltipRef.current?.offsetHeight || 200;

        let top = 0;
        let left = 0;
        const arrowPosition = currentStep.placement;

        switch (currentStep.placement) {
            case 'top':
                top = rect.top + window.scrollY - tooltipHeight - TOOLTIP_OFFSET;
                left = rect.left + window.scrollX + (rect.width / 2) - (tooltipWidth / 2);
                break;
            case 'bottom':
                top = rect.bottom + window.scrollY + TOOLTIP_OFFSET;
                left = rect.left + window.scrollX + (rect.width / 2) - (tooltipWidth / 2);
                break;
            case 'left':
                top = rect.top + window.scrollY + (rect.height / 2) - (tooltipHeight / 2);
                left = rect.left + window.scrollX - tooltipWidth - TOOLTIP_OFFSET;
                break;
            case 'right':
                top = rect.top + window.scrollY + (rect.height / 2) - (tooltipHeight / 2);
                left = rect.right + window.scrollX + TOOLTIP_OFFSET;
                break;
        }

        // Constrain to viewport
        const margin = 16;
        left = Math.max(margin, Math.min(left, window.innerWidth - tooltipWidth - margin));
        top = Math.max(margin, Math.min(top, window.innerHeight + window.scrollY - tooltipHeight - margin));

        setTooltipPosition({ top, left, arrowPosition });
        return true;
    }, [currentStep]);

    // Retry finding element
    useEffect(() => {
        if (!isActive || isCollapsed || !currentStep) {
            setTargetRect(null);
            setTooltipPosition(null);
            setRetryCount(0);
            return;
        }

        const found = findAndPositionTarget();
        if (!found && retryCount < MAX_RETRIES) {
            const timer = setTimeout(() => {
                setRetryCount(prev => prev + 1);
            }, RETRY_INTERVAL);
            return () => clearTimeout(timer);
        } else if (!found && retryCount >= MAX_RETRIES) {
            // Skip this step if element not found
            nextStep();
        }
    }, [isActive, isCollapsed, currentStep, retryCount, findAndPositionTarget, nextStep]);

    // Reset retry count on step change
    useEffect(() => {
        setRetryCount(0);
    }, [currentStepIndex]);

    // Recalculate on resize/scroll
    useEffect(() => {
        if (!isActive || isCollapsed) return;

        const handleResize = () => findAndPositionTarget();
        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleResize, true);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleResize, true);
        };
    }, [isActive, isCollapsed, findAndPositionTarget]);

    // Keyboard navigation
    useEffect(() => {
        if (!isActive || isCollapsed) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Escape':
                    collapse();
                    break;
                case 'ArrowRight':
                case 'Enter':
                    nextStep();
                    break;
                case 'ArrowLeft':
                    prevStep();
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isActive, isCollapsed, nextStep, prevStep, collapse]);

    // Don't render if not active
    if (!isActive) return null;

    // Collapsed state - show mini button
    if (isCollapsed) {
        return (
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={resume}
                className="fixed bottom-6 right-6 z-[9999] p-4 bg-orange-600 text-white rounded-full shadow-2xl hover:bg-orange-700 transition-colors"
                aria-label="Resume tour"
            >
                <HelpCircle className="w-6 h-6" />
            </motion.button>
        );
    }

    return (
        <AnimatePresence>
            {/* Backdrop overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9998] pointer-events-none"
                style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    // Create spotlight cutout using CSS mask
                    maskImage: targetRect
                        ? `radial-gradient(ellipse ${targetRect.width + 20}px ${targetRect.height + 20}px at ${targetRect.left + targetRect.width / 2}px ${targetRect.top + targetRect.height / 2}px, transparent 100%, black 100%)`
                        : 'none',
                    WebkitMaskImage: targetRect
                        ? `radial-gradient(ellipse ${targetRect.width + 20}px ${targetRect.height + 20}px at ${targetRect.left + targetRect.width / 2}px ${targetRect.top + targetRect.height / 2}px, transparent 100%, black 100%)`
                        : 'none',
                }}
            />

            {/* Spotlight border */}
            {targetRect && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="fixed z-[9998] pointer-events-none rounded-xl border-2 border-orange-500 shadow-[0_0_0_4px_rgba(249,115,22,0.2)]"
                    style={{
                        top: targetRect.top - 4,
                        left: targetRect.left - 4,
                        width: targetRect.width + 8,
                        height: targetRect.height + 8,
                    }}
                />
            )}

            {/* Tooltip */}
            {tooltipPosition && currentStep && (
                <motion.div
                    ref={tooltipRef}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="fixed z-[9999] w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
                    style={{
                        top: tooltipPosition.top,
                        left: tooltipPosition.left,
                    }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="tour-title"
                >
                    {/* Header */}
                    <div className="px-5 pt-4 pb-3 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-orange-50 to-amber-50">
                        <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                            Step {currentStepIndex + 1} of {totalSteps}
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={collapse}
                                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                aria-label="Minimize tour"
                            >
                                <Minimize2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={skipTour}
                                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                aria-label="Skip tour"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                        <h3 id="tour-title" className="text-lg font-bold text-slate-900 mb-2">
                            {currentStep.title}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {currentStep.description}
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="px-5 py-4 bg-slate-50 flex items-center justify-between border-t border-slate-100">
                        <button
                            onClick={prevStep}
                            disabled={currentStepIndex === 0}
                            className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back
                        </button>

                        {/* Progress dots */}
                        <div className="flex items-center gap-1.5">
                            {Array.from({ length: totalSteps }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full transition-colors ${i === currentStepIndex ? 'bg-orange-600' : 'bg-slate-300'
                                        }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextStep}
                            className="flex items-center gap-1 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-xl shadow-sm transition-colors"
                        >
                            {currentStepIndex === totalSteps - 1 ? 'Finish' : 'Next'}
                            {currentStepIndex < totalSteps - 1 && <ChevronRight className="w-4 h-4" />}
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
