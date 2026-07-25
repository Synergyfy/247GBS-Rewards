import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword } from '../../bcypt/bcrypt';
import { Role } from '../../core/enums/roles';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  async findUserByEmail(email: string) {
    const user = await this.userRepository.exists({ where: { email } });
    return user;
  }

  async findUserByPhoneNumber(phoneNumber: string) {
    const user = await this.userRepository.exists({ where: { phoneNumber } });
    return user;
  }

  async getUserbyEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  async create(payload: CreateUserDto) {
    const hashedPassword = await hashPassword(payload.password ?? 'mypassword');
    const user = this.userRepository.create({
      ...payload,
      password: hashedPassword,
    });

    await this.userRepository.save(user);
    return user;
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findAllAdmins() {
    return await this.userRepository.find({ where: { role: Role.ADMIN } });
  }

  //TODO: CREATE STAFF ACCOUNT AND ROLE

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    return user;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
