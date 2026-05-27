import { AbstractBaseEntity } from '../../../entities/base.entity';
import { Business } from '../../business/entities/business.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('Staffs')
export class Staff extends AbstractBaseEntity {
  @ManyToOne(() => Business, (business) => business.staffs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  business: Business;

  @ApiProperty({ example: 'Staff Name', description: 'The name of the staff member' })
  @Column()
  name: string;

  @ApiProperty({ example: 'staff@example.com', description: 'The email of the staff member' })
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ApiProperty({ example: 'avatar.png', description: 'The avatar URL', required: false })
  @Column({ nullable: true })
  avatar: string;

  @ApiProperty({ example: true, description: 'Whether the staff member is active' })
  @Column({ default: true })
  isActive: boolean;
}
