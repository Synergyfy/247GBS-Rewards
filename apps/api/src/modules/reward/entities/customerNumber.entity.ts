import { Campaign } from '../../campaign/entities/campaign.entity.js';
import type { Relation } from 'typeorm';
import { AbstractBaseEntity } from '../../../entities/base.entity.js';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Customer } from '../../customer/entities/customer.entity.js';

@Entity('Customers Number')
export class CustomerNumber extends AbstractBaseEntity {
  @ManyToOne(() => Campaign, (campaign) => campaign.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  campaign: Relation<Campaign>;

  @ManyToOne(() => Customer, (customer) => customer.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  customer: Relation<Customer>;

  @Column({ nullable: false })
  code: string;

  @Column({ nullable: false, default: '1' })
  type: string;
}
