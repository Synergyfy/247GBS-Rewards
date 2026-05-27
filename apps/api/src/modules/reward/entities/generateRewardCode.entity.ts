import { Campaign } from '../../campaign/entities/campaign.entity';
import { AbstractBaseEntity } from '../../../entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Staff } from '../../staff/entities/staff.entity';
import { Reward } from './reward.entity';

@Entity('Reward Merchant Codes')
export class GeneratedRewardCode extends AbstractBaseEntity {
  @ManyToOne(() => Campaign, (campaign) => campaign.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  campaign: Campaign;

  @ManyToOne(() => Staff, (staff) => staff.id)
  @JoinColumn()
  staff: Staff;

  @Column({ type: 'timestamp' })
  expiry: Date;

  @ManyToOne(() => Reward, (reward) => reward.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  reward: Reward;

  @Column({ nullable: false })
  code: string;
}
