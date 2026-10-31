import { AbstractBaseEntity } from '../../../entities/base.entity.js';
import type { Relation } from 'typeorm';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Business } from './business.entity.js';

@Entity('Links')
export class Link extends AbstractBaseEntity {
  @ManyToOne(() => Business, (business) => business.links, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  business: Relation<Business>;
  @Column()
  url: string;
  @Column()
  text: string;
}
