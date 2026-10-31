import { User } from '../../user/entities/user.entity.js';
import type { Relation } from 'typeorm';
import { AbstractBaseEntity } from '../../../entities/base.entity.js';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BalanceType } from '../types/payment.enum.js';
import { Audit } from './audit.entity.js';

@Entity('Audits Balance')
export class AuditBalance extends AbstractBaseEntity {
  @ManyToOne(() => User, (user) => user.audits, { onDelete: 'CASCADE' })
  user: Relation<User>;

  @Column({ type: 'enum', enum: BalanceType })
  type: BalanceType;

  @Column({ type: 'integer', default: 0 })
  autumn: number;

  @Column({ type: 'integer', default: 0 })
  spring: number;

  @Column({ type: 'integer', default: 0 })
  summer: number;

  @Column({ type: 'integer', default: 0 })
  winter: number;

  @ManyToOne(() => Audit, (audit) => audit.balance, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  audit: Relation<Audit>; // Optional relationship to Audit entity
}
