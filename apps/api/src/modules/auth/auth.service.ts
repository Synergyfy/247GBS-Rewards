import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { SSOAuth } from './entities/auth.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(SSOAuth)
    private ssoAuthRepo: Repository<SSOAuth>,
  ) {}

  login(payload: { sub: string; email: string; role?: string }): {
    accessToken: string;
  } {
    const accessToken = this.jwtService.sign({ ...payload });

    return { accessToken };
  }

  async createSSOEntry(userId: string) {
    const ssoEntry = this.ssoAuthRepo.create({ userId });
    await this.ssoAuthRepo.save(ssoEntry);
    return ssoEntry.id;
  }

  async findSSOEntry(ssoId: string) {
    const ssoEntry = await this.ssoAuthRepo.findOne({ where: { id: ssoId } });
    return ssoEntry;
  }

  async deleteSSOEntry(ssoId: string) {
    await this.ssoAuthRepo.delete(ssoId);
  }
}
