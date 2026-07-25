import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateAuthDto,
  CreateCustomerAuthDto,
  SSOLoginDto,
} from './dto/create-auth.dto';
import { UserService } from '../user/user.service';
import {
  PasswordFieldsDontMatch,
  SSOEntryDoesNotExistException,
  UserDoesNotExistException,
} from '../../httpErrors/userErrors';
import { comparePasswords } from '../../bcypt/bcrypt';
import { SkipAuth } from '../../core/decorators/skipAuth.decorator';
import { CustomerService } from '../customer/customer.service';
import { StaffService } from '../staff/staff.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly customerService: CustomerService,
    private readonly staffService: StaffService,
  ) {}

  @SkipAuth()
  @Post()
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 400, description: 'Invalid credentials.' })
  @ApiBody({ type: CreateAuthDto })
  async create(@Body() createAuthDto: CreateAuthDto) {
    const emailExists = await this.userService.findUserByEmail(
      createAuthDto.email,
    );
    if (!emailExists) throw new UserDoesNotExistException();

    const user = await this.userService.getUserbyEmail(createAuthDto.email);

    const passwordMatced = await comparePasswords(
      createAuthDto.password,
      user.password,
    );

    if (!passwordMatced) throw new PasswordFieldsDontMatch();

    const payload = { sub: user.id, email: user.email, role: user.role };

    const token = await this.authService.login(payload);
    return { ...token, name: user.fullName, role: user.role };
  }

  @SkipAuth()
  @Post('/customer')
  @ApiOperation({ summary: 'Login customer' })
  @ApiResponse({ status: 200, description: 'Customer successfully logged in.' })
  @ApiResponse({ status: 404, description: 'Customer or Campaign not found.' })
  @ApiBody({ type: CreateCustomerAuthDto })
  async createCustomer(@Body() createAuthDto: CreateCustomerAuthDto) {
    const user = await this.customerService.findOneByEmail(
      createAuthDto.email,
      createAuthDto.campaignId,
    );
    if (!user) throw new UserDoesNotExistException();

    const passwordMatced = await comparePasswords(
      createAuthDto.password,
      user.password,
    );

    if (!passwordMatced) throw new PasswordFieldsDontMatch();

    const payload = { sub: user.id, email: user.email };

    return await this.authService.login(payload);
  }

  @SkipAuth()
  @Post('/staff')
  @ApiOperation({ summary: 'Login staff' })
  @ApiResponse({ status: 200, description: 'Staff successfully logged in.' })
  @ApiResponse({ status: 404, description: 'Staff not found.' })
  @ApiBody({ type: CreateAuthDto })
  async createStaff(@Body() createAuthDto: CreateAuthDto) {
    const user = await this.staffService.findOneByEmail(createAuthDto.email);
    if (!user) throw new UserDoesNotExistException();

    const passwordMatced = await comparePasswords(
      createAuthDto.password,
      user.password,
    );

    if (!passwordMatced) throw new PasswordFieldsDontMatch();

    const payload = { sub: user.id, email: user.email };

    return await this.authService.login(payload);
  }

  @Post('/sso-business')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate SSO token for business' })
  @ApiResponse({ status: 201, description: 'SSO token generated.' })
  async createSSO(@Req() req) {
    const userId: string = req.user.userId;

    const businessOwner = await this.userService.findOne(userId);
    if (!businessOwner) throw new UserDoesNotExistException();

    const ssoId = await this.authService.createSSOEntry(userId);
    if (ssoId) return ssoId;
  }

  @SkipAuth()
  @Post('/sso-login/')
  @ApiOperation({ summary: 'Login via SSO token' })
  @ApiResponse({ status: 200, description: 'Successfully logged in via SSO.' })
  @ApiResponse({ status: 404, description: 'SSO Entry or User not found.' })
  @ApiBody({ type: SSOLoginDto })
  async loginSSO(@Body() ssoLoginDto: SSOLoginDto) {
    const ssoEntry = await this.authService.findSSOEntry(ssoLoginDto.ssoId);
    if (!ssoEntry) throw new SSOEntryDoesNotExistException();
    await this.authService.deleteSSOEntry(ssoEntry.id);
    const user = await this.userService.findOne(ssoEntry.userId);
    if (!user) throw new UserDoesNotExistException();
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = await this.authService.login(payload);
    return { ...token, name: user.fullName, role: user.role };
  }
}
