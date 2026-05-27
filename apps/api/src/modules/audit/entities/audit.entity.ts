import { User } from '../../../modules/user/entities/user.entity';
import { AbstractBaseEntity } from '../../../entities/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AuditBalance } from './auditBalance.entity';

@Entity('Audits')
export class Audit extends AbstractBaseEntity {
  @ManyToOne(() => User, (user) => user.audits, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'jsonb' })
  audit: Record<string, any>;

  @OneToMany(() => AuditBalance, (auditBalance) => auditBalance.audit, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  balance: AuditBalance[];
}
