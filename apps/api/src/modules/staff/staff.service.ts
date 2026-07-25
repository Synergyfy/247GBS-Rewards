import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff } from './entities/staff.entity';
import { Repository } from 'typeorm';
import { Business } from '../business/entities/business.entity';
import { hashPassword } from '../../bcypt/bcrypt';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
  ) {}

  async create(createStaffDto: CreateStaffDto, business: Business) {
    const password = await hashPassword(createStaffDto.password);

    const staff = this.staffRepository.create({
      ...createStaffDto,
      password,
      business,
    });
    await this.staffRepository.save(staff);
    return staff;
  }

  async findStaffByBusiness(businessId: string) {
    const staffs = await this.staffRepository.find({
      where: { business: { id: businessId } },
    });

    return staffs;
  }

  async findOneByEmail(email: string) {
    const staff = await this.staffRepository.findOne({ where: { email } });
    return staff;
  }

  async findAllByUser(userId: string) {
    const staffs = await this.staffRepository.find({
      where: { business: { user: { id: userId } } },
    });
    return staffs;
  }

  async findOne(id: string): Promise<Staff> {
    const staff = await this.staffRepository.findOne({ where: { id } });
    if (!staff) {
      throw new NotFoundException(`Staff with ID ${id} not found`);
    }
    return staff;
  }

  async update(id: string, updateStaffDto: UpdateStaffDto): Promise<Staff> {
    const staff = await this.findOne(id);
    Object.assign(staff, updateStaffDto);
    await this.staffRepository.save(staff);
    return staff;
  }

  async remove(id: string): Promise<void> {
    const staff = await this.findOne(id);
    await this.staffRepository.remove(staff);
  }
}
