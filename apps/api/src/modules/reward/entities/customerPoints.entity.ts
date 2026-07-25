import { Campaign } from '../../../modules/campaign/entities/campaign.entity';
import { AbstractBaseEntity } from '../../../entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Customer } from '../../../modules/customer/entities/customer.entity';

@Entity('Customer points')
export class CustomerPoint extends AbstractBaseEntity {
  @ManyToOne(() => Campaign, (campaign) => campaign.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  campaign: Campaign;

  @ManyToOne(() => Customer, (customer) => customer.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  customer: Customer;

  @Column()
  points: number;

  @Column()
  description: string;
}
