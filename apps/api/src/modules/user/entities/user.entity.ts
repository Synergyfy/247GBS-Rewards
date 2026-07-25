import { Business } from '../../../modules/business/entities/business.entity';
import { AbstractBaseEntity } from '../../../entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { SignupSource } from '../../../core/enums/signupSource';
import { Role } from '../../../core/enums/roles';
import { Audit } from '../../audit/entities/audit.entity';
import { AuditBalance } from '../../audit/entities/auditBalance.entity';
import { AuditPaymentHistory } from '../../audit/entities/payment.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('Users')
export class User extends AbstractBaseEntity {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @Column()
  fullName: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email of the user' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ enum: Role, example: Role.CUSTOMER, description: 'Role of the user' })
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CUSTOMER,
  })
  role: Role;

  @ApiProperty({ example: '+1234567890', description: 'Phone number of the user' })
  @Column({ unique: true })
  phoneNumber: string;

  @ApiProperty({ example: 'New York', description: 'Location', required: false })
  @Column({ nullable: true })
  location: string;

  @ApiProperty({ example: 'REF123', description: 'Referral Code', required: false })
  @Column({ nullable: true })
  referralCode: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: SignupSource, default: SignupSource.MCOM })
  signupSource: SignupSource;

  @OneToMany(() => Business, (business) => business.user)
  businesses: Business[];

  @OneToMany(() => Audit, (audit) => audit.user, { cascade: true })
  audits: Audit[];

  @OneToMany(() => AuditBalance, (balance) => balance.user, { cascade: true })
  balance: AuditBalance[];

  @OneToMany(() => AuditPaymentHistory, (payment) => payment.user, {
    cascade: true,
  })
  payment: AuditPaymentHistory[];
}
