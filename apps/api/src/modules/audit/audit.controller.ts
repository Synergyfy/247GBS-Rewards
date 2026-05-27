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
import { AuditService } from './audit.service';
import {
  CreateAuditDto,
  CreateAuditPaymentHistoryDto,
} from './dto/create-audit.dto';
import { UpdateAuditDto } from './dto/update-audit.dto';
import { UserService } from '../user/user.service';
import { UserDoesNotExistException } from '../../httpErrors/userErrors';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Audit')
@ApiBearerAuth()
@Controller('audit')
export class AuditController {
  constructor(
    private readonly auditService: AuditService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new audit entry' })
  @ApiResponse({ status: 201, description: 'Audit entry created successfully.' })
  @ApiBody({ type: CreateAuditDto })
  async create(@Req() req, @Body() createAuditDto: CreateAuditDto) {
    const userId: string = req.user.userId;
    const { audit } = createAuditDto;
    const user = await this.userService.findOne(userId);
    if (!user) throw new UserDoesNotExistException();
    return this.auditService.create(user, audit);
  }

  @Get('find-all/')
  @ApiOperation({ summary: 'Find all audits for the logged-in user' })
  @ApiResponse({ status: 200, description: 'List of audits.' })
  async findAuditsByUser(@Req() req) {
    const userId: string = req.user.userId;
    const user = await this.userService.findOne(userId);
    if (!user) throw new UserDoesNotExistException();
    const audits = await this.auditService.findAuditsByUser(user.id);
    return audits;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find an audit by ID' })
  @ApiResponse({ status: 200, description: 'Audit found.' })
  @ApiResponse({ status: 404, description: 'Audit not found.' })
  findOne(@Param('id') id: string) {
    return this.auditService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an audit by ID' })
  @ApiResponse({ status: 200, description: 'Audit updated successfully.' })
  @ApiBody({ type: UpdateAuditDto })
  update(@Param('id') id: string, @Body() updateAuditDto: UpdateAuditDto) {
    return this.auditService.update(+id, updateAuditDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an audit by ID' })
  @ApiResponse({ status: 200, description: 'Audit deleted successfully.' })
  remove(@Param('id') id: string) {
    return this.auditService.remove(+id);
  }

  //ROUTES FOR PAYMENT ACITIVITIES
  @Post('payment-activity')
  @ApiOperation({ summary: 'Create a payment activity audit' })
  @ApiResponse({
    status: 201,
    description: 'Payment activity created successfully.',
  })
  @ApiBody({ type: CreateAuditPaymentHistoryDto })
  async createPaymentActivity(
    @Req() req,
    @Body() payload: CreateAuditPaymentHistoryDto,
  ) {
    const userId: string = req.user.userId;
    const user = await this.userService.findOne(userId);
    if (!user) throw new UserDoesNotExistException();

    const { status, autumn, spring, summer, winter, type } = payload;
    return this.auditService.createPaymentActivity(
      user,
      status,
      autumn,
      spring,
      summer,
      winter,
      type,
    );
  }
}
