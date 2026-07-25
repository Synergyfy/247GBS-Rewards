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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { UserService } from '../user/user.service';
import { Business } from './entities/business.entity';
import {
  EmailExistException,
  PhoneNumberExistException,
  UserDoesNotExistException,
} from '../../httpErrors/userErrors';

@ApiTags('business')
@ApiBearerAuth()
@Controller('business')
export class BusinessController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new business' })
  @ApiResponse({
    status: 201,
    description: 'The business has been successfully created.',
    type: Business,
  })
  @ApiBody({ type: CreateBusinessDto })
  async create(@Req() req, @Body() createBusinessDto: CreateBusinessDto) {
    const userId = req.user.userId;
    const user = await this.userService.findOne(userId);
    if (!user) throw new UserDoesNotExistException();

    const { email, phoneNumber } = createBusinessDto;

    const checkEmail = await this.businessService.findOneByEmail(email);
    if (checkEmail) throw new EmailExistException();

    const checkPhoneNumber =
      await this.businessService.findOneByPhoneNumber(phoneNumber);
    if (checkPhoneNumber) throw new PhoneNumberExistException();

    return this.businessService.create(createBusinessDto, user);
  }

  @Get('/all-businesses')
  @ApiOperation({ summary: 'Get all businesses for the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Return all businesses for the authenticated user.',
    type: [Business],
  })
  async findAllByUser(@Req() req) {
    const userId: string = req.user.userId;
    return await this.businessService.findAllBusinessByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a business by ID' })
  @ApiParam({ name: 'id', description: 'ID of the business' })
  @ApiResponse({
    status: 200,
    description: 'Return the business.',
    type: Business,
  })
  @ApiResponse({ status: 404, description: 'Business not found.' })
  findOne(@Param('id') id: string) {
    return this.businessService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a business by ID' })
  @ApiParam({ name: 'id', description: 'ID of the business' })
  @ApiResponse({
    status: 200,
    description: 'The business has been successfully updated.',
    type: Business,
  })
  @ApiResponse({ status: 404, description: 'Business not found.' })
  @ApiBody({ type: UpdateBusinessDto })
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ) {
    const userId: string = req.user.userId;
    const user = await this.userService.findOne(userId);
    return this.businessService.update(id, updateBusinessDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a business by ID' })
  @ApiParam({ name: 'id', description: 'ID of the business' })
  @ApiResponse({
    status: 200,
    description: 'The business has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Business not found.' })
  async remove(@Param('id') id: string) {
    return this.businessService.remove(id);
  }
}
