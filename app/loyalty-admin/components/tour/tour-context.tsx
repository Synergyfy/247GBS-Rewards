'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { TourStep, tourSteps } from './tour-steps';

// ============================================
// Types
// ============================================
interface TourState {
    isActive: boolean;
    isCollapsed: boolean;
    currentStepIndex: number;
    hasCompletedTour: boolean;
}

interface TourContextValue extends TourState {
    currentStep: TourStep | null;
    totalSteps: number;
    startTour: () => void;
    endTour: () => void;
    nextStep: () => void;
    prevStep: () => void;
    skipTour: () => void;
    collapse: () => void;
    resume: () => void;
    goToStep: (index: number) => void;
}

// ============================================
// Constants
// ============================================
const STORAGE_KEY = 'loyaltypro_tour_state';

const defaultState: TourState = {
    isActive: false,
    isCollapsed: false,
    currentStepIndex: 0,
    hasCompletedTour: false,
};

// ============================================
// Context
// ============================================
const TourContext = createContext<TourContextValue | null>(null);

// ============================================
// Provider
// ============================================
export function TourProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [state, setState] = useState<TourState>(defaultState);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load state from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved) as Partial<TourState>;
                setState(prev => ({
                    ...prev,
                    hasCompletedTour: parsed.hasCompletedTour ?? false,
                    currentStepIndex: parsed.currentStepIndex ?? 0,
                    isCollapsed: parsed.isCollapsed ?? false,
                }));
            }
        } catch (e) {
            console.warn('Failed to load tour state from localStorage');
        }
        setIsInitialized(true);
    }, []);

    // Auto-start tour for first-time users
    useEffect(() => {
        if (isInitialized && !state.hasCompletedTour && !state.isActive) {
            // Small delay to let the page render
            const timer = setTimeout(() => {
                setState(prev => ({ ...prev, isActive: true }));
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isInitialized, state.hasCompletedTour, state.isActive]);

    // Persist state to localStorage
    useEffect(() => {
        if (isInitialized) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify({
                    hasCompletedTour: state.hasCompletedTour,
                    currentStepIndex: state.currentStepIndex,
                    isCollapsed: state.isCollapsed,
                }));
            } catch (e) {
                console.warn('Failed to save tour state to localStorage');
            }
        }
    }, [state.hasCompletedTour, state.currentStepIndex, state.isCollapsed, isInitialized]);

    // Current step
    const currentStep = state.isActive ? tourSteps[state.currentStepIndex] ?? null : null;

    // Navigate to step's route if needed
    useEffect(() => {
        if (currentStep?.route && pathname !== currentStep.route) {
            router.push(currentStep.route);
        }
    }, [currentStep, pathname, router]);

    // Actions
    const startTour = useCallback(() => {
        setState(prev => ({
            ...prev,
            isActive: true,
            isCollapsed: false,
            currentStepIndex: 0,
        }));
    }, []);

    const endTour = useCallback(() => {
        setState(prev => ({
            ...prev,
            isActive: false,
            isCollapsed: false,
            hasCompletedTour: true,
        }));
    }, []);

    const skipTour = useCallback(() => {
        endTour();
    }, [endTour]);

    const nextStep = useCallback(() => {
        setState(prev => {
            const nextIndex = prev.currentStepIndex + 1;
            if (nextIndex >= tourSteps.length) {
                return { ...prev, isActive: false, hasCompletedTour: true };
            }
            return { ...prev, currentStepIndex: nextIndex };
        });
    }, []);

    const prevStep = useCallback(() => {
        setState(prev => ({
            ...prev,
            currentStepIndex: Math.max(0, prev.currentStepIndex - 1),
        }));
    }, []);

    const collapse = useCallback(() => {
        setState(prev => ({ ...prev, isCollapsed: true }));
    }, []);

    const resume = useCallback(() => {
        setState(prev => ({ ...prev, isCollapsed: false }));
    }, []);

    const goToStep = useCallback((index: number) => {
        if (index >= 0 && index < tourSteps.length) {
            setState(prev => ({ ...prev, currentStepIndex: index, isCollapsed: false }));
        }
    }, []);

    const value: TourContextValue = {
        ...state,
        currentStep,
        totalSteps: tourSteps.length,
        startTour,
        endTour,
        nextStep,
        prevStep,
        skipTour,
        collapse,
        resume,
        goToStep,
    };

    return (
        <TourContext.Provider value={value}>
            {children}
        </TourContext.Provider>
    );
}

// ============================================
// Hook
// ============================================
export function useTour(): TourContextValue {
    const context = useContext(TourContext);
    if (!context) {
        throw new Error('useTour must be used within a TourProvider');
    }
    return context;
}
