import { User } from '../../user/entities/user.entity.js';
import type { Relation } from 'typeorm';
import { AbstractBaseEntity } from '../../../entities/base.entity.js';
import { Column, Entity, ManyToOne } from 'typeorm';
import { PaymentStatus, PaymentType } from '../types/payment.enum.js';

@Entity('Audits Payment History')
export class AuditPaymentHistory extends AbstractBaseEntity {
  @ManyToOne(() => User, (user) => user.audits, { onDelete: 'CASCADE' })
  user: Relation<User>;

  @Column({ type: 'enum', enum: PaymentStatus })
  status: PaymentStatus;

  @Column({ type: 'enum', enum: PaymentType })
  type: PaymentType;

  @Column({ type: 'integer', default: 0 })
  amount: number;

  @Column({ type: 'integer', default: 0 })
  autumn: number;

  @Column({ type: 'integer', default: 0 })
  spring: number;

  @Column({ type: 'integer', default: 0 })
  summer: number;

  @Column({ type: 'integer', default: 0 })
  winter: number;
}
