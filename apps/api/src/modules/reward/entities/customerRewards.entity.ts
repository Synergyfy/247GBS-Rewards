import { Campaign } from '../../campaign/entities/campaign.entity.js';
import type { Relation } from 'typeorm';
import { AbstractBaseEntity } from '../../../entities/base.entity.js';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Customer } from '../../customer/entities/customer.entity.js';
import { Reward } from './reward.entity.js';
import { ApiProperty } from '@nestjs/swagger';

@Entity('CustomersRewards')
export class CustomersReward extends AbstractBaseEntity {
  @ApiProperty({ type: () => Campaign })
  @ManyToOne(() => Campaign, (campaign) => campaign.id, { onDelete: 'CASCADE' })
  campaign: Relation<Campaign>;

  @ApiProperty({ type: () => Customer })
  @ManyToOne(() => Customer, (customer) => customer.id, { onDelete: 'CASCADE' })
  customer: Relation<Customer>;

  @ApiProperty({ type: () => Reward })
  @ManyToOne(() => Reward, (reward) => reward.id, { onDelete: 'CASCADE' })
  reward: Relation<Reward>;

  @ApiProperty({ description: 'Description of the reward redemption', nullable: true })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ description: 'Unique code for the reward', nullable: true })
  @Column({ nullable: true })
  uniqueCode: string;
}
