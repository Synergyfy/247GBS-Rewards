import { AbstractBaseEntity } from '../../../entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('SSO Auth')
export class SSOAuth extends AbstractBaseEntity {
  @Column({ nullable: false })
  userId: string;
}
