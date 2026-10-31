import { Module } from '@nestjs/common';
import { AuditService } from './audit.service.js';
import { AuditController } from './audit.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Audit } from './entities/audit.entity.js';
import { UserModule } from '../user/user.module.js';
import { AuditPaymentHistory } from './entities/payment.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Audit, AuditPaymentHistory]), UserModule],
  controllers: [AuditController],
  providers: [AuditService],
})
export class AuditModule {}
