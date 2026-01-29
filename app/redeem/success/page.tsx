'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CheckCircle2, ArrowRight, Scan, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SuccessNotfication = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Fallback values in case params are missing
    const points = searchParams.get('points') || '0';
    const message = searchParams.get('message') || 'Reward Redeemed';
    const campaignName = searchParams.get('campaignName') || 'Campaign';

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
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">

            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-black to-black -z-10" />
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-20 -z-10 mix-blend-overlay"></div>

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="w-full max-w-md flex flex-col items-center text-center space-y-8 z-10"
            >
                {/* Icon Circle */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-green-500 blur-2xl opacity-40 rounded-full" />
                    <div className="relative w-32 h-32 bg-gradient-to-tr from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-black">
                        <CheckCircle2 className="w-16 h-16 text-white" />
                    </div>
                </motion.div>

                {/* Text Content */}
                <div className="space-y-4">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-white"
                    >
                        Awesome!
                    </motion.h1>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-zinc-400 text-lg"
                    >
                        You've successfully claimed your reward for <span className="text-white font-semibold">{campaignName}</span>
                    </motion.p>
                </div>

                {/* Points Card */}
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="w-full bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 transform hover:scale-105 transition-transform duration-300"
                >
                    <div className="text-sm font-medium text-emerald-500 uppercase tracking-widest mb-2">Points Earned</div>
                    <div className="text-6xl font-black text-white mb-2">+{points}</div>
                    <div className="inline-block px-4 py-1.5 bg-zinc-800 rounded-full text-zinc-300 text-sm font-medium border border-zinc-700">
                        {message}
                    </div>
                </motion.div>

                {/* Actions */}
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col w-full space-y-3 pt-4"
                >
                    <Button
                        onClick={() => router.push('/scan')}
                        className="h-14 bg-white text-black hover:bg-zinc-200 rounded-2xl text-lg font-bold shadow-lg shadow-white/10 transition-all active:scale-95"
                    >
                        <Scan className="w-5 h-5 mr-2" />
                        Scan Another
                    </Button>
                    <Button
                        onClick={() => router.push('/dashboard')}
                        variant="ghost"
                        className="h-14 text-zinc-400 hover:text-white hover:bg-zinc-900/50 rounded-2xl text-lg transition-all"
                    >
                        <Home className="w-5 h-5 mr-2" />
                        Go to Dashboard
                    </Button>
                </motion.div>

            </motion.div>
        </div>
    );
};

export default function RedemptionSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
            <SuccessNotfication />
        </Suspense>
    );
}
