import { User } from '../../user/entities/user.entity';
import { AbstractBaseEntity } from '../../../entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BalanceType } from '../types/payment.enum';
import { Audit } from './audit.entity';

@Entity('Audits Balance')
export class AuditBalance extends AbstractBaseEntity {
  @ManyToOne(() => User, (user) => user.audits, { onDelete: 'CASCADE' })
  user: User;

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
  audit: Audit; // Optional relationship to Audit entity
}
