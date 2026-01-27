import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Gift, Lock, Unlock, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface Reward {
    id: string;
    title: string;
    description: string;
    pointCost?: string | number;
    pointsRequired?: number;
    image?: string;
    headerImg?: string;
    value?: string | number;
    quantity?: number;
    remainingQuantity?: number;
    gallery?: string[] | null;
}

interface PublicRewardCardProps {
    reward: Reward;
    userPoints?: number;
    isMember?: boolean;
    onRedeem?: (reward: Reward) => void;
    className?: string;
    isLoading?: boolean;
}

export default function PublicRewardCard({
    reward,
    userPoints = 0,
    isMember = false,
    onRedeem,
    className,
    isLoading = false
}: PublicRewardCardProps) {
    const pointsRequired = Number(reward.pointCost || reward.pointsRequired || 0);
    const rewardImage = reward.image || reward.headerImg || 'https://placehold.co/600x400?text=Reward';

    const [activeImage, setActiveImage] = useState<string>(rewardImage);

    React.useEffect(() => {
        setActiveImage(rewardImage);
    }, [rewardImage]);

    const progress = isMember && pointsRequired > 0
        ? Math.min((userPoints / pointsRequired) * 100, 100)
        : 0;

    const canRedeem = isMember && (
        (pointsRequired > 0 && userPoints >= pointsRequired) ||
        (pointsRequired === 0)
    );

    const isValidSrc = (src: string) => {
        return src && (src.startsWith('http') || src.startsWith('https') || src.startsWith('/') || src.startsWith('data:'));
    };

    return (
        <div className={cn(
            "group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 flex flex-col h-full border border-gray-100",
            className
        )}>
            {/* Image Section */}
            <div className="relative h-64 w-full overflow-hidden">
                <Image
                    src={isValidSrc(activeImage) ? activeImage : 'https://placehold.co/600x400?text=Reward'}
                    alt={reward.title}
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-110 transition-transform duration-700 ease-out"
                    unoptimized
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80" />

                <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 backdrop-blur-md text-gray-900 border-none px-3 py-1 font-bold shadow-lg">
                        {reward.remainingQuantity !== undefined ? `${reward.remainingQuantity} Left` : 'Available'}
                    </Badge>
                </div>

                <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                    {pointsRequired > 0 && (
                        <div className="bg-white/95 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2 border border-white/50">
                            <Trophy className="w-4 h-4 text-[#2D3DFF]" />
                            <span className="font-bold text-lg">{pointsRequired}</span>
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pts</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 flex-grow flex flex-col">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-[#2D3DFF] transition-colors mb-2">
                        {reward.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: reward.description }} />
                </div>

                <div className="mt-auto space-y-4">
                    {isMember && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-medium">
                                <span className={canRedeem ? "text-green-600 font-bold" : "text-gray-500"}>
                                    {canRedeem ? "Ready to Redeem!" : `${Math.max(0, pointsRequired - userPoints)} more pts needed`}
                                </span>
                                <span className="text-gray-400">{Math.round(progress)}%</span>
                            </div>
                            <Progress
                                value={progress}
                                className="h-2 bg-gray-100"
                                indicatorClassName={canRedeem ? "bg-green-500" : "bg-[#2D3DFF]"}
                            />
                        </div>
                    )}

                    {onRedeem ? (
                        <Button
                            onClick={() => onRedeem(reward)}
                            disabled={!canRedeem || isLoading}
                            className={cn(
                                "w-full py-6 rounded-xl text-base font-bold shadow-md transition-all duration-300",
                                canRedeem
                                    ? "bg-[#2D3DFF] hover:bg-blue-700 text-white hover:shadow-lg hover:scale-[1.02]"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            )}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Redeeming...
                                </span>
                            ) : canRedeem ? (
                                <span className="flex items-center gap-2">
                                    <Unlock className="w-4 h-4" /> Redeem Reward
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Lock className="w-4 h-4" /> Locked
                                </span>
                            )}
                        </Button>
                    ) : (
                        !isMember && (
                            <div className="pt-2 border-t border-gray-50 flex items-center justify-between text-sm text-gray-400">
                                <span className="flex items-center gap-1.5 font-medium">
                                    <Gift className="w-4 h-4" /> Reward
                                </span>
                                <span className="text-[#2D3DFF] font-bold">Join to Earn</span>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
