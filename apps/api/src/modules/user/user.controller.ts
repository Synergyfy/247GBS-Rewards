import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  EmailExistException,
  PasswordFieldsDontMatch,
  PhoneNumberExistException,
} from '../../httpErrors/userErrors';
import { User } from './entities/user.entity';
import { SkipAuth } from '../../core/decorators/skipAuth.decorator';
import { SignupSource } from '../../core/enums/signupSource';
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

    return await this.userService.create(createUserDto);
  }

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
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

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
