import { Injectable } from '@nestjs/common';
import { CreateAuditDto } from './dto/create-audit.dto';
import { UpdateAuditDto } from './dto/update-audit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Audit } from './entities/audit.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { AuditPaymentHistory } from './entities/payment.entity';
import { PaymentStatus, PaymentType, Seasons } from './types/payment.enum';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(Audit)
    private auditRepository: Repository<Audit>,
    @InjectRepository(AuditPaymentHistory)
    private auditPaymentHistoryRepo: Repository<AuditPaymentHistory>,
  ) {}

  async create(user: User, audit: Record<string, any>) {
    const newAudit = this.auditRepository.create({ user, audit });
    await this.auditRepository.save(newAudit);
    return newAudit;
  }

  async findAuditsByUser(userId: string) {
    const audits = await this.auditRepository.find({
      where: { user: { id: userId } },
    });
    return audits;
  }

  findOne(id: number) {
    return `This action returns a #${id} audit`;
  }

  update(id: number, updateAuditDto: UpdateAuditDto) {
    return `This action updates a #${id} audit`;
  }

  remove(id: number) {
    return `This action removes a #${id} audit`;
  }

  // CREATEING PAYMENT ACTIVITIES
  async createPaymentActivity(
    user: User,
    status: PaymentStatus,
    autumn: number,
    spring: number,
    summer: number,
    winter: number,
    type: PaymentType,
  ) {
    const newPaymentActivity = this.auditPaymentHistoryRepo.create({
      user,
      status,
      autumn,
      spring,
      summer,
      winter,
      type,
    });

    await this.auditPaymentHistoryRepo.save(newPaymentActivity);
    return newPaymentActivity;
  }
}
