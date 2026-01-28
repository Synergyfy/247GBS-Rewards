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
import { CheckCircle2, Gift, ExternalLink } from "lucide-react";
import { format } from 'date-fns';

interface RedemptionSuccessDialogProps {
    isOpen: boolean;
    onClose: () => void;
    rewardTitle: string;
    redemptionData?: any;
}

export const RedemptionSuccessDialog = ({
    isOpen,
    onClose,
    rewardTitle,
    redemptionData,
}: RedemptionSuccessDialogProps) => {
    const isMcomLoyaltyReward = redemptionData?.reward?.type === 'MCOM_LOYALTY_TIER';

    if (isMcomLoyaltyReward) {
        const customerName = redemptionData?.customer?.fullName || 'Customer';
        const uniqueCode = redemptionData?.uniqueCode;
        const expiryDate = redemptionData?.reward?.expires ? format(new Date(redemptionData.reward.expires), 'd MMM yyyy') : '';
        const activationLink = `https://mcomloyalty.vercel.app/business/signup?provisionCode=${uniqueCode}`;

        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-md text-center">
                    <DialogHeader>
                        <div className="mx-auto w-16 h-16 bg-blue-100 text-[#2D3DFF] rounded-full flex items-center justify-center mb-4">
                             <Gift className="w-10 h-10" />
                        </div>
                        <DialogTitle className="text-2xl font-bold text-gray-900">
                            🎉 Congratulations {customerName}!
                        </DialogTitle>
                        <DialogDescription className="text-lg pt-4 text-gray-600">
                             You’ve unlocked: <span className="font-bold text-[#2D3DFF] block mt-1">{rewardTitle}</span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4 space-y-4">
                        {expiryDate && (
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <p className="text-sm text-gray-500">This reward is valid until</p>
                                <p className="font-semibold text-gray-900">{expiryDate}</p>
                            </div>
                        )}

                        <p className="text-sm text-gray-500">
                            Click below to activate your reward
                        </p>
                    </div>

                    <DialogFooter className="flex flex-col gap-3 sm:gap-3">
                         <Button
                            asChild
                            className="w-full bg-[#2D3DFF] hover:bg-blue-700 text-white font-bold py-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all"
                        >
                            <a href={activationLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                                Activate Reward Now <ExternalLink className="w-5 h-5" />
                            </a>
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="w-full text-gray-500 hover:text-gray-700"
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

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
