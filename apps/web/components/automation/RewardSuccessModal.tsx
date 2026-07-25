'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface RewardSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    reward: {
        points: number;
        message: string;
        campaignName: string;
    } | null;
}

const RewardSuccessModal: React.FC<RewardSuccessModalProps> = ({ isOpen, onClose, reward }) => {
    if (!reward) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white text-black dark:bg-zinc-900 dark:text-white border-none shadow-2xl">
                <DialogHeader className="flex flex-col items-center justify-center space-y-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    >
                        <CheckCircle2 className="w-20 h-20 text-green-500" />
                    </motion.div>
                    <DialogTitle className="text-2xl font-bold text-center">Reward Unlocked!</DialogTitle>
                    <DialogDescription className="text-center text-gray-500">
                        You've successfully claimed your reward from <span className="font-semibold text-primary">{reward.campaignName}</span>.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-green-50 to-transparent rounded-xl border border-green-100 dark:from-green-900/20 dark:border-green-900/50">
                    <div className="text-4xl font-extrabold text-green-600 dark:text-green-400">
                        +{reward.points}
                    </div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-2 uppercase tracking-wide">
                        Points Added
                    </div>
                    <div className="mt-4 px-3 py-1 bg-white dark:bg-zinc-800 rounded-full text-xs font-semibold text-gray-500 shadow-sm">
                        {reward.message}
                    </div>
                </div>

                <div className="flex justify-center mt-4">
                    <Button onClick={onClose} className="w-full bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-all duration-300">
                        Awesome!
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default RewardSuccessModal;
