export interface JoinCampaignResponse {
    message: string;
}

export interface IsJoinedResponse {
    isJoined: boolean;
}

export interface ParticipantBalance {
    campaignId: string;
    campaignName: string;
    balance: number;
    stampBalance?: number;
}

export interface ClaimCodePayload {
    code: string;
    campaignId: string;
}

export interface ClaimCodeResponse {
    message: string;
    pointsAwarded: number;
}

export interface UniqueCodeResponse {
    uniqueCode: string;
}

export interface ParticipantHistoryItem {
    id: string;
    createdAt: string;
    type: 'EARN' | 'REDEEM' | 'MATCHING';
    points: number;
    description: string;
    reward?: {
        title: string;
    };
}

export interface ParticipantHistoryResponse {
    data: ParticipantHistoryItem[];
    total: number;
    page: number;
    limit: number;
}

export interface RedeemRewardPayload {
    staffId: string;
    participantId: string;
    rewardId: string;
    redemptionCode: string;
}

export interface RedeemRewardResponse {
    id: string;
    createdAt: string;
}
