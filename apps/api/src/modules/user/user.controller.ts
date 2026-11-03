import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '../../core/enums/roles.js';
import { Roles } from '../../core/decorators/roles.decorator.js';
import { UserService } from './user.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import {
  EmailExistException,
  PasswordFieldsDontMatch,
  PhoneNumberExistException,
} from '../../httpErrors/userErrors.js';
import { User } from './entities/user.entity.js';
import { SkipAuth } from '../../core/decorators/skipAuth.decorator.js';
import { SignupSource } from '../../core/enums/signupSource.js';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @SkipAuth()
  @Post()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Email or phone number already exists, or passwords do not match.',
  })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const { signupSource, password, password2 } = createUserDto;

    if (signupSource === SignupSource.STOCK_AUDIT) {
      if (!password || password !== password2)
        throw new PasswordFieldsDontMatch();
    }

    const emailExists = await this.userService.findUserByEmail(
      createUserDto.email,
    );

    if (emailExists) throw new EmailExistException();
    const phoneNumberExists = await this.userService.findUserByPhoneNumber(
      createUserDto.phoneNumber,
    );

    if (phoneNumberExists) throw new PhoneNumberExistException();

    // Public signup must never let the caller pick their role (e.g. super_admin)
    return await this.userService.create({ ...createUserDto, role: Role.ADMIN });
  }

  @Roles(Role.SUPER_ADMIN)
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Return all users.',
    type: [User],
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the user.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOne(
    @Param('id') id: string,
    @Req() req: { user: { userId: string; role: Role } },
  ) {
    // Users may read their own record; only super admins may read anyone's
    if (req.user.role !== Role.SUPER_ADMIN && req.user.userId !== id) {
      throw new ForbiddenException();
    }
    const user = await this.userService.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Roles(Role.SUPER_ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
