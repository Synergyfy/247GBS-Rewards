'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CheckCircle2, Scan, Home, Gift, ExternalLink, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SuccessNotification = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Params
    const points = searchParams.get('points'); // Optional
    const message = searchParams.get('message');
    const campaignName = searchParams.get('campaignName');
    const rewardName = searchParams.get('rewardName');
    const expiryDate = searchParams.get('expiryDate');
    const activationLink = searchParams.get('activationLink');
    const customerName = searchParams.get('customerName');
    const successTitle = searchParams.get('successTitle');
    const successMessage = searchParams.get('successMessage');

    const isPointsReward = !!points;
    const title = rewardName || campaignName || 'Reward';

    useEffect(() => {
        // Trigger confetti on mount
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => {
            return Math.random() * (max - min) + min;
        }

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            // since particles fall down, start a bit higher than random
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
            });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">

            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50 via-white to-gray-50 -z-10" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -z-10 opacity-60"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-100/50 rounded-full blur-3xl -z-10 opacity-60"></div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="w-full max-w-md flex flex-col items-center text-center space-y-6 z-10"
            >
                {/* Header Section with Name */}
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900"
                >
                    {customerName ? `Congratulations, ${customerName}!` : 'Congratulations!'}
                </motion.h1>
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-500 text-lg"
                >
                    {successMessage || (isPointsReward ? 'Points added to your balance.' : 'You have a new reward!')}
                </motion.p>


                {/* Main Card */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="w-full bg-white shadow-2xl shadow-blue-500/10 border border-gray-100 rounded-3xl p-8 transform hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-green-500"></div>

                    {/* Icon */}
                    <div className="mb-6 flex justify-center">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center shadow-inner">
                            {isPointsReward ? (
                                <CheckCircle2 className="w-10 h-10 text-green-500" />
                            ) : (
                                <Gift className="w-10 h-10 text-indigo-500" />
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {isPointsReward ? (
                            <>
                                <div className="text-6xl font-black text-gray-900 tracking-tight">+{points}</div>
                                <div className="text-sm font-bold text-green-600 uppercase tracking-widest bg-green-50 py-1 px-3 rounded-full inline-block">
                                    {message || 'Points Earned'}
                                </div>
                                <p className="text-gray-500 pt-2">for <span className="font-semibold text-gray-800">{campaignName}</span></p>
                            </>
                        ) : (
                            <>
                                <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                                    {title}
                                </h3>

                                {expiryDate && (
                                    <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mt-2 bg-gray-50 p-2 rounded-lg">
                                        <Calendar className="w-4 h-4" />
                                        <span>Valid Until: <span className="font-semibold text-gray-700">{expiryDate}</span></span>
                                    </div>
                                )}

                                {!activationLink && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        Show this to the merchant to claim.
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </motion.div>

                {/* Actions */}
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col w-full space-y-3 pt-2"
                >
                    {activationLink && (
                        <Button
                            asChild
                            className="h-14 bg-[#2D3DFF] hover:bg-blue-700 text-white rounded-2xl text-lg font-bold shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                        >
                            <a href={activationLink} target="_blank" rel="noopener noreferrer">
                                Activate Reward <ExternalLink className="w-5 h-5 ml-2" />
                            </a>
                        </Button>
                    )}

                    {!activationLink && (
                        <Button
                            onClick={() => router.push(activationLink ? '/dashboard' : '/scan')}
                            className="h-14 bg-gray-900 text-white hover:bg-black rounded-2xl text-lg font-bold shadow-lg transition-all active:scale-95"
                        >
                            <Scan className="w-5 h-5 mr-2" />
                            Scan Another
                        </Button>
                    )}

                    <Button
                        onClick={() => router.push('/dashboard')}
                        variant="ghost"
                        className="h-14 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-2xl text-lg transition-all"
                    >
                        <Home className="w-5 h-5 mr-2" />
                        Dashboard
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default function RedemptionSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Loading...</div>}>
            <SuccessNotification />
        </Suspense>
    );
}
