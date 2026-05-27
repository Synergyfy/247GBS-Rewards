import { AbstractBaseEntity } from '../../../entities/base.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { Business } from './business.entity';

@Entity('Socials')
export class Social extends AbstractBaseEntity {
  @OneToOne(() => Business, (business) => business.socials, {
    onDelete: 'CASCADE',
  })
  business: Business;
  @Column({ default: 'Check out our social media' })
  socialText: string;
  @Column({ nullable: true })
  facebook: string;
  @Column({ nullable: true })
  youtube: string;
  @Column({ nullable: true })
  vimeo: string;
  @Column({ nullable: true })
  whatsapp: string;
  @Column({ nullable: true })
  instagram: string;
  @Column({ nullable: true })
  x: string;
  @Column({ nullable: true })
  linkedIn: string;
  @Column({ nullable: true })
  tumblr: string;
  @Column({ nullable: true })
  snapchat: string;
  @Column({ nullable: true })
  pinterest: string;
  @Column({ nullable: true })
  telegram: string;
  @Column({ nullable: true })
  medium: string;
}
