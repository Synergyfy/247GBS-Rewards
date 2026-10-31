import { Injectable } from '@nestjs/common';
import { CreateBusinessDto } from './dto/create-business.dto.js';
import { UpdateBusinessDto } from './dto/update-business.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business } from './entities/business.entity.js';
import { Address } from './entities/address.entity.js';
import { Social } from './entities/socials.entity.js';
import { Link } from './entities/link.entity.js';
import { User } from '../user/entities/user.entity.js';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
    @InjectRepository(Address) private addressRepository: Repository<Address>,
    @InjectRepository(Social) private socialRepository: Repository<Social>,
    @InjectRepository(Link) private linkRepository: Repository<Link>,
  ) {}

  async create(createBusinessDto: CreateBusinessDto, user: User) {
    const address = this.addressRepository.create(createBusinessDto.address);
    await this.addressRepository.save(address);

    const socials = this.socialRepository.create(createBusinessDto.socials);
    await this.socialRepository.save(socials);

    const links = createBusinessDto.links?.map((linkDto) => {
      const link = this.linkRepository.create(linkDto);
      return this.linkRepository.save(link);
    });

    const savedLinks = links ? await Promise.all(links) : [];

    const business = this.businessRepository.create({
      ...createBusinessDto,
      user,
      address,
      socials,
      links: savedLinks,
    });

    await this.businessRepository.save(business);

    return business;
  }

  async findAllBusinessByUser(id: string) {
    const businesses = await this.businessRepository.find({
      where: { user: { id } },
      relations: {
  address: true,
  socials: true,
  links: true,
},
    });
    return businesses;
  }

  findAll() {
    return `This action returns all business`;
  }

  async findOne(id: string) {
    const business = await this.businessRepository.findOne({
      where: { id },
      relations: {
  user: true,
  address: true,
  socials: true,
  links: true,
}
    });
    return business;
  }

  async findOneByEmail(email: string) {
    const business = await this.businessRepository.findOne({
      where: { email },
    });
    return business;
  }
  async findOneByPhoneNumber(phoneNumber: string) {
    const business = await this.businessRepository.findOne({
      where: { phoneNumber },
    });
    return business;
  }

  async update(id: string, updateBusinessDto: UpdateBusinessDto, user: User) {
    const business = await this.businessRepository.findOne({
      where: { id },
      relations: {
  address: true,
  socials: true,
  links: true,
},
    });

    if (!business) {
      throw new Error('Business not found');
    }

    if (updateBusinessDto.address) {
      Object.assign(business.address, updateBusinessDto.address);
      await this.addressRepository.save(business.address);
    }

    if (updateBusinessDto.socials) {
      Object.assign(business.socials, updateBusinessDto.socials);
      await this.socialRepository.save(business.socials);
    }

    if (updateBusinessDto.links) {
      await this.linkRepository.remove(business.links);

      const newLinks = updateBusinessDto.links.map((linkDto) => {
        const link = this.linkRepository.create(linkDto);
        return this.linkRepository.save(link);
      });

      business.links = await Promise.all(newLinks);
    }

    Object.assign(business, {
      ...updateBusinessDto,
      user,
    });

    await this.businessRepository.save(business);

    return business;
  }

  async remove(businessId: string) {
    await this.businessRepository.delete(businessId);
  }
}
