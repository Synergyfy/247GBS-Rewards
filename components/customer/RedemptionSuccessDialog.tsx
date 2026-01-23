import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Gift } from "lucide-react";

interface RedemptionSuccessDialogProps {
    isOpen: boolean;
    onClose: () => void;
    rewardTitle: string;
}

export const RedemptionSuccessDialog = ({
    isOpen,
    onClose,
    rewardTitle,
}: RedemptionSuccessDialogProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md text-center">
                <DialogHeader>
                    <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <DialogTitle className="text-2xl font-bold text-gray-900">Redemption Successful!</DialogTitle>
                    <DialogDescription className="text-lg pt-2">
                        You have successfully redeemed <span className="font-bold text-[#2D3DFF]">{rewardTitle}</span>.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-6">
                    <p className="text-gray-500">
                        Show this confirmation to the merchant to claim your physical reward. A copy of this redemption has been added to your history.
                    </p>
                </div>
                <DialogFooter>
                    <Button
                        onClick={onClose}
                        className="w-full bg-[#2D3DFF] hover:bg-blue-700 text-white font-bold py-3 rounded-xl"
                    >
                        Great, thanks!
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
