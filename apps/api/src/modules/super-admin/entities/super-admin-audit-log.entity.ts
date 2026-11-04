import type { Relation } from 'typeorm';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractBaseEntity } from '../../../entities/base.entity.js';
import { User } from '../../user/entities/user.entity.js';

export enum SuperAdminAuditTargetType {
  USER = 'user',
  BUSINESS = 'business',
  CAMPAIGN = 'campaign',
  STAFF = 'staff',
  CUSTOMER = 'customer',
  CODE = 'code',
}

/**
 * Append-only record of every mutating action performed from the super-admin
 * dashboard. Separate from the stock-audit `Audits` table.
 */
@Entity('SuperAdmin Audit Logs')
export class SuperAdminAuditLog extends AbstractBaseEntity {
  @ApiProperty({
    type: () => User,
    nullable: true,
    description: 'Super-admin account that performed the action',
  })
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  @Index()
  actor: Relation<User> | null;

  @ApiProperty({ example: 'user.status_changed' })
  @Column({ type: 'varchar' })
  action: string;

  @ApiProperty({ enum: SuperAdminAuditTargetType })
  @Column({ type: 'enum', enum: SuperAdminAuditTargetType })
  @Index()
  targetType: SuperAdminAuditTargetType;

  @ApiProperty({ example: 'cbc5bf3f-b608-4b87-b4d0-ee457aac9573' })
  @Column({ type: 'varchar' })
  @Index()
  targetId: string;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: true,
    nullable: true,
    description: 'Action-specific details',
  })
  @Column({ type: 'jsonb', nullable: true })
  payload: Record<string, unknown> | null;

  @ApiPropertyOptional({ example: '127.0.0.1', nullable: true })
  @Column({ type: 'varchar', nullable: true })
  ip: string | null;
}
