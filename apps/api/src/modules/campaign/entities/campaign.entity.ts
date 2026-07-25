import { Business } from '../../../modules/business/entities/business.entity';
import { AbstractBaseEntity } from '../../../entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Reward } from '../../../modules/reward/entities/reward.entity';
import { Customer } from '../../../modules/customer/entities/customer.entity';
import { CampaignType } from '../../../core/enums/campaignType';
import { Season } from './season.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('Campaign')
export class Campaign extends AbstractBaseEntity {
  @ManyToOne(() => Business, (business) => business.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  business: Business;

  @OneToMany(() => Reward, (reward) => reward.campaign, { cascade: true })
  @JoinColumn()
  rewards: Reward[];

  @ApiProperty({ enum: CampaignType })
  @Column({
    type: 'enum',
    enum: CampaignType,
    default: CampaignType.PRESET,
  })
  type: CampaignType;

  @ApiProperty({ type: () => Season, description: 'The season this campaign belongs to', nullable: true })
  @ManyToOne(() => Season, (season) => season.campaigns, { nullable: true })
  @JoinColumn()
  season: Season;

  @ApiProperty({ description: 'Name of the campaign', example: 'Winter Sale 2024' })
  @Column()
  name: string;

  @ApiProperty({
    description: 'The start date and time of the campaign',
    example: '2024-01-01T00:00:00Z',
    nullable: true
  })
  @Column({ nullable: true })
  startDate: Date;

  @ApiProperty({
    description: 'The end date and time of the campaign',
    example: '2024-12-31T23:59:59Z',
    nullable: true
  })
  @Column({ nullable: true })
  endDate: Date;

  @ApiProperty({ description: 'Points awarded upon signing up', example: '100' })
  @Column({ nullable: true })
  signupPoints: string;

  @ApiProperty({ description: 'Custom domain for the campaign', example: 'loyalty.example.com', nullable: true })
  @Column({ nullable: true })
  customDomain: string;

  // earn point
  @ApiProperty({ description: 'Allow earning points via staff scanning QR', default: true })
  @Column({ type: 'boolean', default: true })
  earnStaffScanQR: boolean;

  @ApiProperty({ description: 'Allow earning points by entering a code', default: true })
  @Column({ type: 'boolean', default: true })
  earnEnterCode: boolean;

  @ApiProperty({ description: 'Allow earning points via staff personal code', default: true })
  @Column({ type: 'boolean', default: true })
  earnStaffPersonalCode: boolean;

  @ApiProperty({ description: 'Allow earning points by giving staff number', default: true })
  @Column({ type: 'boolean', default: true })
  earnGiveStaffNumber: boolean;

  // redeem point
  @ApiProperty({ description: 'Allow redeeming points via staff scanning QR', default: true })
  @Column({ type: 'boolean', default: true })
  redeemStaffScanQR: boolean;

  @ApiProperty({ description: 'Allow redeeming points via staff personal code', default: true })
  @Column({ type: 'boolean', default: true })
  redeemStaffPersonalCode: boolean;

  @ApiProperty({ description: 'Allow redeeming points by giving staff number', default: true })
  @Column({ type: 'boolean', default: true })
  redeemGiveStaffNumber: boolean;

  // top bar content
  @ApiProperty()
  @Column({ nullable: true })
  topTitle: string;
  @ApiProperty()
  @Column({ nullable: true })
  topHeadline: string;

  //home
  @ApiProperty()
  @Column({ default: 'Welcome to our new loyalty program' })
  homeTitle: string;
  @ApiProperty()
  @Column({
    default:
      'This new way of saving is our biggest and best savings program ever.',
  })
  homeText: string;

  @ApiProperty()
  @Column({ nullable: true })
  headerImg: string;

  @ApiProperty()
  @Column({ nullable: true })
  columnsTitle: string;

  @ApiProperty()
  @Column({ nullable: true })
  col1Title: string;
  @ApiProperty()
  @Column({ nullable: true })
  col1Text: string;
  @ApiProperty()
  @Column({ nullable: true })
  col1Img: string;

  @ApiProperty()
  @Column({ nullable: true })
  col2Title: string;
  @ApiProperty()
  @Column({ nullable: true })
  col2Text: string;
  @ApiProperty()
  @Column({ nullable: true })
  col2Img: string;

  @ApiProperty()
  @Column({ nullable: true })
  col3Title: string;
  @ApiProperty()
  @Column({ nullable: true })
  col3Text: string;
  @ApiProperty()
  @Column({ nullable: true })
  col3Img: string;

  //earn
  @ApiProperty()
  @Column({ default: 'Earn Points' })
  earnTitle: string;
  @ApiProperty()
  @Column({
    default: 'Get points for every dollar you spend.',
  })
  earnText: string;

  @ApiProperty()
  @Column({ nullable: true })
  earnImg: string;

  // redeem
  @ApiProperty()
  @Column({ default: 'Rewards' })
  redeemTitle: string;
  @ApiProperty()
  @Column({
    default: 'Earn points and choose from these rewards.',
  })
  redeemText: string;

  @ApiProperty()
  @Column({ nullable: true })
  redeemImg: string;

  // contact
  @ApiProperty()
  @Column({ default: 'Contact Us' })
  contactTitle: string;
  @ApiProperty()
  @Column({
    default: 'Get in touch.',
  })
  contactText: string;

  @ApiProperty()
  @Column({ nullable: true })
  contactImg: string;

  //colors
  @ApiProperty()
  @Column({ default: '#EEEEEE' })
  background: string;
  @ApiProperty()
  @Column({ default: '#333333' })
  text: string;

  @ApiProperty()
  @Column({ default: '#111111' })
  primaryBg: string;
  @ApiProperty()
  @Column({ default: '#ffffff' })
  primaryText: string;

  @ApiProperty()
  @Column({ default: '#0D47A1' })
  secondaryBg: string;
  @ApiProperty()
  @Column({ default: '#ffffff' })
  secondaryText: string;

  // mobile colors
  @ApiProperty()
  @Column({ default: '#0D47A1' })
  mobileNavBg: string;
  @ApiProperty()
  @Column({ default: '#ffffff' })
  mobileNavText: string;
  @ApiProperty()
  @Column({ default: '#0D47A1' })
  mobileNavActiveBg: string;
  @ApiProperty()
  @Column({ default: '#ffffff' })
  mobileNavActiveText: string;

  @ApiProperty()
  @Column({ unique: true, nullable: false }) // Ensure the column is unique
  uniqueCode: string;

  @OneToMany(() => Customer, (customer) => customer.campaign, { cascade: true })
  customers: Customer[];
}
