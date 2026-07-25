import { Campaign } from '../../campaign/entities/campaign.entity';
import { AbstractBaseEntity } from '../../../entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Customer } from '../../customer/entities/customer.entity';

@Entity('Customers Number')
export class CustomerNumber extends AbstractBaseEntity {
  @ManyToOne(() => Campaign, (campaign) => campaign.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  campaign: Campaign;

  @ManyToOne(() => Customer, (customer) => customer.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  customer: Customer;

  @Column({ nullable: false })
  code: string;

  @Column({ nullable: false, default: '1' })
  type: string;
}
