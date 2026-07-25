import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
export default registerAs(
  'auth',
  (): JwtModuleOptions => ({
    secret: process.env.JWT_SECRET || 'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq',
    signOptions: {
      expiresIn: (process.env.JWT_EXPIRY_TIMEFRAME as any) || '24h',
    },
  }),
);
