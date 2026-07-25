import { AbstractBaseEntity } from '../../../entities/base.entity';
import { Business } from '../../../modules/business/entities/business.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('Segments')
export class Segment extends AbstractBaseEntity {
  @Column()
  name: string;

  @ManyToOne(() => Business, (business) => business.segments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  business: Business;
}
