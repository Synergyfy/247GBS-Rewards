import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { jwtConstants } from '../../core/constant/auth';
import { CustomerModule } from '../customer/customer.module';
import { StaffModule } from '../staff/staff.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SSOAuth } from './entities/auth.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([SSOAuth]),
    UserModule,
    PassportModule,
    forwardRef(() => CustomerModule),
    StaffModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [PassportModule, JwtModule, AuthService],
})
export class AuthModule {}
