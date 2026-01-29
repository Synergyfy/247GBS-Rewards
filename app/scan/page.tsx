'use client';

import React, { useState } from 'react';
import QRScanner from '@/components/automation/QRScanner';
import { mockAutomationService, ValidationResponse } from '@/services/mockAutomationService';
import { toast } from 'sonner';
import { QrCode, Zap, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const ScanPage = () => {
    const router = useRouter();
    const [scanning, setScanning] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleScan = async (code: string) => {
        if (processing) return;
        setScanning(false);
        setProcessing(true);

        try {
            const response = await mockAutomationService.validateTrigger(code);

            if (response.success && response.reward) {
                const params = new URLSearchParams({
                    points: response.reward.points.toString(),
                    message: response.reward.message,
                    campaignName: response.reward.campaignName
                });
                router.push(`/redeem/success?${params.toString()}`);
            } else {
                toast.error(response.error || 'Unknown error occurred.');
                // Allow retry after delay
                setTimeout(() => setProcessing(false), 2000);
            }
        } catch (error) {
            toast.error('Failed to validate QR code.');
            setProcessing(false);
        }
    };



    return (
        <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-green-500/30">

            {/* Header */}
            <header className="p-6 flex items-center justify-between z-10">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon" className="rounded-full text-zinc-400 hover:text-white hover:bg-white/10">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                </Link>
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-400 to-blue-500 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white fill-current" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">AutoMessage</span>
                </div>
                <div className="w-10"></div> {/* Spacer */}
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">

                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-green-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

                <div className="text-center mb-8 max-w-lg">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400"
                    >
                        Scan to Earn
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-400 text-lg"
                    >
                        Instantly unlock rewards by scanning valid campaign codes. No waiting, no hassle.
                    </motion.p>
                </div>

                {/* Scanner Container */}
                <div className="w-full max-w-md relative z-20">
                    {!scanning && !processing && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="aspect-[3/4] bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-3xl flex flex-col items-center justify-center p-8 hover:bg-zinc-900/80 transition-colors cursor-pointer group shadow-2xl"
                            onClick={() => setScanning(true)}
                        >
                            <div className="w-24 h-24 rounded-full bg-zinc-800 group-hover:bg-zinc-700 flex items-center justify-center mb-6 transition-all duration-300 shadow-inner group-hover:shadow-green-500/20">
                                <QrCode className="w-10 h-10 text-zinc-400 group-hover:text-green-400 transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Tap to Scan</h3>
                            <p className="text-zinc-500 text-center text-sm">Camera permission required</p>
                        </motion.div>
                    )}

                    {scanning && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <QRScanner onScan={handleScan} onClose={() => setScanning(false)} />
                        </motion.div>
                    )}

                    {processing && (
                        <div className="aspect-[3/4] bg-zinc-900 border border-zinc-800 rounded-3xl flex flex-col items-center justify-center p-8">
                            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-zinc-400 animate-pulse">Verifying code...</p>
                        </div>
                    )}
                </div>

            </main>

            {/* Footer */}
            <footer className="p-6 text-center text-zinc-600 text-xs">
                Powered by 247GBS Automated Rewards
            </footer>
        </div>
    );
};

export default ScanPage;
