import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UserModule } from '../user/user.module.js';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy.js';
import { jwtConstants } from '../../core/constant/auth.js';
import { CustomerModule } from '../customer/customer.module.js';
import { StaffModule } from '../staff/staff.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SSOAuth } from './entities/auth.entity.js';
import { McomSsoService } from './mcom-sso.service.js';
import { User } from '../user/entities/user.entity.js';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([SSOAuth, User]),
    UserModule,
    PassportModule,
    forwardRef(() => CustomerModule),
    StaffModule,
  ],
  providers: [AuthService, JwtStrategy, McomSsoService],
  controllers: [AuthController],
  exports: [PassportModule, JwtModule, AuthService],
})
export class AuthModule {}
