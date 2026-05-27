import { AbstractBaseEntity } from '../../../entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Business } from '../../business/entities/business.entity';
import { Campaign } from './campaign.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('Season')
export class Season extends AbstractBaseEntity {
  @ApiProperty({ description: 'Name of the season', example: 'Summer 2024' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Season start date', example: '2024-06-01T00:00:00Z' })
  @Column()
  startDate: Date;

  @ApiProperty({ description: 'Season end date', example: '2024-08-31T23:59:59Z' })
  @Column()
  endDate: Date;

  @ManyToOne(() => Business, (business) => business.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  business: Business;

  @OneToMany(() => Campaign, (campaign) => campaign.season)
  campaigns: Campaign[];
}
