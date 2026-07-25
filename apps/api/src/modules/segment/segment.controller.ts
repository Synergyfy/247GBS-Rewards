import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { SegmentService } from './segment.service';
import { CreateSegmentDto } from './dto/create-segment.dto';
import { UpdateSegmentDto } from './dto/update-segment.dto';
import { BusinessService } from '../business/business.service';
import { BusinessDoesNotExistException } from '../../httpErrors/bussiness.error';
import { SegmentDoesntExistException } from '../../httpErrors/segment.error';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Segment')
@ApiBearerAuth()
@Controller('segment')
export class SegmentController {
  constructor(
    private readonly segmentService: SegmentService,
    private readonly businessService: BusinessService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new segment' })
  @ApiResponse({ status: 201, description: 'Segment created successfully.' })
  @ApiResponse({ status: 404, description: 'Business not found.' })
  @ApiBody({ type: CreateSegmentDto })
  async create(@Body() createSegmentDto: CreateSegmentDto) {
    const { businessId } = createSegmentDto;
    const business = await this.businessService.findOne(businessId);

    if (!business) throw new BusinessDoesNotExistException();

    const segment = await this.segmentService.create(
      createSegmentDto,
      business,
    );
    return segment;
  }

  @Get('all-segments')
  @ApiOperation({ summary: 'Get all segments for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of segments.' })
  async findAllByUser(@Req() req) {
    const userId: string = req.user.userId;
    return await this.segmentService.findAllByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a segment by ID' })
  @ApiResponse({ status: 200, description: 'Segment found.' })
  @ApiResponse({ status: 404, description: 'Segment not found.' })
  findOne(@Param('id') id: string) {
    return this.segmentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a segment by ID' })
  @ApiResponse({ status: 200, description: 'Segment updated successfully.' })
  @ApiResponse({ status: 404, description: 'Segment not found.' })
  @ApiBody({ type: UpdateSegmentDto })
  async update(
    @Param('id') id: string,
    @Body() updateSegmentDto: UpdateSegmentDto,
  ) {
    const segment = await this.segmentService.findOne(id);
    if (!segment) throw new SegmentDoesntExistException();
    return this.segmentService.update(segment, updateSegmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a segment by ID' })
  @ApiResponse({ status: 200, description: 'Segment deleted successfully.' })
  remove(@Param('id') id: string) {
    return this.segmentService.remove(id);
  }
}
