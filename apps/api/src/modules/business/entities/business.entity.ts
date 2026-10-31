import { AbstractBaseEntity } from '../../../entities/base.entity.js';
import type { Relation } from 'typeorm';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Address } from './address.entity.js';
import { User } from '../../../modules/user/entities/user.entity.js';
import { Social } from './socials.entity.js';
import { Link } from './link.entity.js';
import { Segment } from '../../../modules/segment/entities/segment.entity.js';
import { Staff } from '../../../modules/staff/entities/staff.entity.js';
import { Campaign } from '../../../modules/campaign/entities/campaign.entity.js';
import { Season } from '../../campaign/entities/season.entity.js';
import { ApiProperty } from '@nestjs/swagger';

@Entity('Business')
export class Business extends AbstractBaseEntity {
  @ManyToOne(() => User, (user) => user.businesses)
  @JoinColumn()
  user: Relation<User>;

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
  address: Relation<Address>;

  @OneToOne(() => Social, (social) => social.business, { cascade: true })
  @JoinColumn()
  socials: Relation<Social>;

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
