import { Campaign } from '../../campaign/entities/campaign.entity';
import { AbstractBaseEntity } from '../../../entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Customer } from '../../customer/entities/customer.entity';
import { RewardMethod } from '../../../core/enums/rewardMethod';

@Entity('Customers Reward Number')
export class RewardCustomerNumber extends AbstractBaseEntity {
  @ManyToOne(() => Campaign, (campaign) => campaign.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  campaign: Campaign;

  @ManyToOne(() => Customer, (customer) => customer.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  customer: Customer;

  @Column({ nullable: false })
  code: string;

  @Column({ nullable: false, type: 'enum', enum: RewardMethod })
  type: RewardMethod;
}
