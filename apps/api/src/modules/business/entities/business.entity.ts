import { AbstractBaseEntity } from '../../../entities/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Address } from './address.entity';
import { User } from '../../../modules/user/entities/user.entity';
import { Social } from './socials.entity';
import { Link } from './link.entity';
import { Segment } from '../../../modules/segment/entities/segment.entity';
import { Staff } from '../../../modules/staff/entities/staff.entity';
import { Campaign } from '../../../modules/campaign/entities/campaign.entity';
import { Season } from '../../campaign/entities/season.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('Business')
export class Business extends AbstractBaseEntity {
  @ManyToOne(() => User, (user) => user.businesses)
  @JoinColumn()
  user: User;

  @ApiProperty({ example: 'My Business', description: 'The name of the business' })
  @Column()
  name: string;
  @ApiProperty({ example: 'logo.png', description: 'The logo URL', required: false })
  @Column({ nullable: true })
  logo: string;
  @ApiProperty({ example: 'biz@example.com', description: 'The email of the business' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: '+1234567890', description: 'The phone number of the business' })
  @Column({ unique: true })
  phoneNumber: string;

  @ApiProperty({ example: 'https://example.com', description: 'The website of the business', required: false })
  @Column({ nullable: true })
  website: string;

  @OneToOne(() => Address, (address) => address.business, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  address: Address;

  @OneToOne(() => Social, (social) => social.business, { cascade: true })
  @JoinColumn()
  socials: Social;

  @OneToMany(() => Link, (link) => link.business, { cascade: true })
  links: Link[];

  @OneToMany(() => Segment, (segment) => segment.business, { cascade: true })
  segments: Segment[];

  @OneToMany(() => Staff, (staff) => staff.business, { cascade: true })
  staffs: Staff[];

  @OneToMany(() => Campaign, (campaign) => campaign.business, { cascade: true })
  campaigns: Campaign[];

  @OneToMany(() => Season, (season) => season.business, { cascade: true })
  seasons: Season[];
}
