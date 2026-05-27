import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '../../core/guards/auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import {
  OverallAnalyticsResponseDto,
  CampaignAnalyticsResponseDto,
} from './dto/analytics-response.dto';

@ApiTags('analytics')
@ApiBearerAuth()
@Controller('analytics')
// @UseGuards(AuthGuard) // Enable if needed
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overall')
  @ApiOperation({ summary: 'Get overall analytics for the user' })
  @ApiResponse({
    status: 200,
    description: 'Overall analytics data',
    type: OverallAnalyticsResponseDto,
  })
  async getOverallAnalytics(@Req() req) {
    const userId = req.user.userId;
    return this.analyticsService.getOverallAnalytics(userId);
  }

  @Get('campaign/:id')
  @ApiOperation({ summary: 'Get analytics for a specific campaign' })
  @ApiResponse({
    status: 200,
    description: 'Campaign analytics data',
    type: CampaignAnalyticsResponseDto,
  })
  async getCampaignAnalytics(@Param('id') id: string) {
    return this.analyticsService.getCampaignAnalytics(id);
  }
}
