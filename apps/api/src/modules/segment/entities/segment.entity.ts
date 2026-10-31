import { AbstractBaseEntity } from '../../../entities/base.entity.js';
import type { Relation } from 'typeorm';
import { Business } from '../../../modules/business/entities/business.entity.js';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('Segments')
export class Segment extends AbstractBaseEntity {
  @Column()
  name: string;

  @ManyToOne(() => Business, (business) => business.segments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  business: Relation<Business>;
}
