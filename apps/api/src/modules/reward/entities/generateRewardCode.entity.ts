import { Campaign } from '../../campaign/entities/campaign.entity.js';
import type { Relation } from 'typeorm';
import { AbstractBaseEntity } from '../../../entities/base.entity.js';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Staff } from '../../staff/entities/staff.entity.js';
import { Reward } from './reward.entity.js';

@Entity('Reward Merchant Codes')
export class GeneratedRewardCode extends AbstractBaseEntity {
  @ManyToOne(() => Campaign, (campaign) => campaign.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  campaign: Relation<Campaign>;

  @ManyToOne(() => Staff, (staff) => staff.id)
  @JoinColumn()
  staff: Relation<Staff>;

  @Column({ type: 'timestamp' })
  expiry: Date;

  @ManyToOne(() => Reward, (reward) => reward.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  reward: Relation<Reward>;

  @Column({ nullable: false })
  code: string;
}
