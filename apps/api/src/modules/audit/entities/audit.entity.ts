import { User } from '../../../modules/user/entities/user.entity.js';
import type { Relation } from 'typeorm';
import { AbstractBaseEntity } from '../../../entities/base.entity.js';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AuditBalance } from './auditBalance.entity.js';

@Entity('Audits')
export class Audit extends AbstractBaseEntity {
  @ManyToOne(() => User, (user) => user.audits, { onDelete: 'CASCADE' })
  user: Relation<User>;

  @Column({ type: 'jsonb' })
  audit: Record<string, any>;

  @OneToMany(() => AuditBalance, (auditBalance) => auditBalance.audit, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  balance: AuditBalance[];
}
