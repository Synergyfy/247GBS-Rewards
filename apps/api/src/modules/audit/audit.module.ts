import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Audit } from './entities/audit.entity';
import { UserModule } from '../user/user.module';
import { AuditPaymentHistory } from './entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Audit, AuditPaymentHistory]), UserModule],
  controllers: [AuditController],
  providers: [AuditService],
})
export class AuditModule {}
