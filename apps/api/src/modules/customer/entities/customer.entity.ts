import { Campaign } from '../../../modules/campaign/entities/campaign.entity.js';
import type { Relation } from 'typeorm';
import { AbstractBaseEntity } from '../../../entities/base.entity.js';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('Customers')
export class Customer extends AbstractBaseEntity {
  @ApiProperty({ type: () => Campaign })
  @ManyToOne(() => Campaign, (campaign) => campaign.customers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  campaign: Relation<Campaign>;

  @ApiProperty({ example: 'John' })
  @Column()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @Column()
  lastName: string;

  @ApiProperty({ example: 'john@example.com' })
  @Column()
  email: string;

  @Column()
  password: string;
}
