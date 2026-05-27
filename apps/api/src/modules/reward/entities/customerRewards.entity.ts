import { Campaign } from '../../campaign/entities/campaign.entity';
import { AbstractBaseEntity } from '../../../entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Customer } from '../../customer/entities/customer.entity';
import { Reward } from './reward.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('CustomersRewards')
export class CustomersReward extends AbstractBaseEntity {
  @ApiProperty({ type: () => Campaign })
  @ManyToOne(() => Campaign, (campaign) => campaign.id, { onDelete: 'CASCADE' })
  campaign: Campaign;

  @ApiProperty({ type: () => Customer })
  @ManyToOne(() => Customer, (customer) => customer.id, { onDelete: 'CASCADE' })
  customer: Customer;

  @ApiProperty({ type: () => Reward })
  @ManyToOne(() => Reward, (reward) => reward.id, { onDelete: 'CASCADE' })
  reward: Reward;

  @ApiProperty({ description: 'Description of the reward redemption', nullable: true })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ description: 'Unique code for the reward', nullable: true })
  @Column({ nullable: true })
  uniqueCode: string;
}
