import { AbstractBaseEntity } from '../../../entities/base.entity.js';
import type { Relation } from 'typeorm';
import { Column, Entity, OneToOne } from 'typeorm';
import { Business } from './business.entity.js';

@Entity('Address')
export class Address extends AbstractBaseEntity {
  @Column()
  street: string;
  @Column()
  postalCode: string;
  @Column()
  city: string;
  @Column()
  state: string;
  @OneToOne(() => Business, (business) => business.address, {
    onDelete: 'CASCADE',
  })
  business: Relation<Business>;
}
