import { User } from '../../../modules/user/entities/user.entity';
import { AbstractBaseEntity } from '../../../entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Campaign } from '../../../modules/campaign/entities/campaign.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('Rewards')
export class Reward extends AbstractBaseEntity {
  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  pointCost: string;

  @ApiProperty({ nullable: true })
  @Column({ default: '$', nullable: true })
  currency: string;

  @ApiProperty()
  @Column()
  rewardValue: string;

  @ApiProperty()
  @Column()
  activeFrom: string;

  @ApiProperty()
  @Column()
  expires: string;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  description: string;

  @ApiProperty()
  @Column({ default: 'STANDARD' })
  type: string;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  successPageTitle: string;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  successPageMessage: string;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  successPageButtonLink: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'json', nullable: true })
  config: Record<string, unknown> | null;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  quantityAvailable: number;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  quantityRemaining: number;

  @ApiProperty({ type: () => Campaign })
  @ManyToOne(() => Campaign, (campaign) => campaign.rewards, {
    onDelete: 'CASCADE',
  })
  campaign: Campaign;
}
