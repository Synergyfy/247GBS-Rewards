import { IsNotEmpty, IsString } from 'class-validator'; import { ApiProperty } from '@nestjs/swagger'; export class JoinCampaignDto { @ApiProperty() @IsString() @IsNotEmpty() campaignId: string; }
