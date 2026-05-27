import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { BusinessService } from '../business/business.service';
import { BusinessDoesNotExistException } from '../../httpErrors/bussiness.error';
import { Staff } from './entities/staff.entity';
import { StaffEmailException } from '../../httpErrors/staff.error';

@ApiTags('staff')
@ApiBearerAuth()
@Controller('staff')
export class StaffController {
  constructor(
    private readonly staffService: StaffService,
    private readonly businessService: BusinessService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new staff member' })
  @ApiResponse({
    status: 201,
    description: 'The staff member has been successfully created.',
    type: Staff,
  })
  @ApiResponse({ status: 404, description: 'Business not found.' })
  @ApiBody({ type: CreateStaffDto })
  async create(@Body() createStaffDto: CreateStaffDto) {
    const { businessId, email } = createStaffDto;
    const business = await this.businessService.findOne(businessId);
    if (!business) throw new BusinessDoesNotExistException();

    const check_staff = await this.staffService.findOneByEmail(email);
    if (check_staff) throw new StaffEmailException();

    return await this.staffService.create(createStaffDto, business);
  }

  @Get('/all-staffs')
  @ApiOperation({ summary: 'Get all staff members' })
  @ApiResponse({
    status: 200,
    description: 'Return all staff members.',
    type: [Staff],
  })
  findAllByUser(@Req() req) {
    const userId: string = req.user.userId;
    return this.staffService.findAllByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a staff member by ID' })
  @ApiParam({ name: 'id', description: 'ID of the staff member' })
  @ApiResponse({
    status: 200,
    description: 'Return the staff member.',
    type: Staff,
  })
  @ApiResponse({ status: 404, description: 'Staff member not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.staffService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a staff member by ID' })
  @ApiParam({ name: 'id', description: 'ID of the staff member' })
  @ApiResponse({
    status: 200,
    description: 'The staff member has been successfully updated.',
    type: Staff,
  })
  @ApiResponse({ status: 404, description: 'Staff member not found.' })
  @ApiBody({ type: UpdateStaffDto })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateStaffDto: UpdateStaffDto) {
    return this.staffService.update(id, updateStaffDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a staff member by ID' })
  @ApiParam({ name: 'id', description: 'ID of the staff member' })
  @ApiResponse({
    status: 200,
    description: 'The staff member has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Staff member not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.staffService.remove(id);
  }
}
