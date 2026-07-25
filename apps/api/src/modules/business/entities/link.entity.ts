import { AbstractBaseEntity } from '../../../entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Business } from './business.entity';

@Entity('Links')
export class Link extends AbstractBaseEntity {
  @ManyToOne(() => Business, (business) => business.links, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  business: Business;
  @Column()
  url: string;
  @Column()
  text: string;
}
