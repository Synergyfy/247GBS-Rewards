import { Campaign } from '../../../modules/campaign/entities/campaign.entity.js';
import type { Relation } from 'typeorm';
import { AbstractBaseEntity } from '../../../entities/base.entity.js';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Customer } from '../../../modules/customer/entities/customer.entity.js';

@Entity('Customer points')
export class CustomerPoint extends AbstractBaseEntity {
  @ManyToOne(() => Campaign, (campaign) => campaign.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  campaign: Relation<Campaign>;

  @ManyToOne(() => Customer, (customer) => customer.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  customer: Relation<Customer>;

  @Column()
  points: number;

  @Column()
  description: string;
}
