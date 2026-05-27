import { AbstractBaseEntity } from '../../../entities/base.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { Business } from './business.entity';

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
  business: Business;
}
