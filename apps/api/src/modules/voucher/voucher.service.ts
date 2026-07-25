import { Injectable, Logger, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Voucher, VoucherType } from "./entities/voucher.entity";
import { CreateVoucherBatchDto } from "./dto/create-voucher.dto";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class VoucherService {
  private readonly logger = new Logger(VoucherService.name);

  constructor(
    @InjectRepository(Voucher)
    private readonly voucherRepository: Repository<Voucher>,
  ) {}

  async generateBatch(dto: CreateVoucherBatchDto) {
    const vouchers: Voucher[] = [];
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + dto.validityDays);

    const mcomLoyaltyUrl = process.env.MCOM_LOYALTY_API_URL || 'http://localhost:3000/api/v1';
    const mcomMallUrl = process.env.MCOM_MALL_API_URL || 'http://localhost:3001/api/v1';

    for (let i = 0; i < dto.count; i++) {
        // Generate a readable code? or UUID? 
        // Readable: PREFIX-RANDOM
        const code = `PROV-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

        const voucher = this.voucherRepository.create({
            code,
            type: dto.type,
            config: dto.config,
            expiresAt
        });

        // External Provisioning
        try {
            if (dto.type === VoucherType.MCOM_LOYALTY_TIER) {
                await this.provisionExternalLoyalty(mcomLoyaltyUrl, code, dto.config, expiresAt);
            } else if (dto.type === VoucherType.MCOM_MALL_TIER) {
                await this.provisionExternalMall(mcomMallUrl, code, dto.config, expiresAt, 'TIER_ACCESS');
            } else if (dto.type === VoucherType.MALL_OFFER) {
                await this.provisionExternalMall(mcomMallUrl, code, dto.config, expiresAt, 'TRIAL_EXTENSION');
            }
        } catch (error) {
            this.logger.error(`Failed to provision voucher ${code} for type ${dto.type}`, error);
            continue; 
        }

        vouchers.push(voucher);
    }

    if (vouchers.length > 0) {
        return this.voucherRepository.save(vouchers);
    }
    return [];
  }

  async generateSingle(type: VoucherType, config: any, validityDays: number = 30): Promise<Voucher> {
      const mcomLoyaltyUrl = process.env.MCOM_LOYALTY_API_URL || 'http://localhost:3000/api/v1';
      const mcomMallUrl = process.env.MCOM_MALL_API_URL || 'http://localhost:3001/api/v1';

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + validityDays);

      const code = `PROV-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      const voucher = this.voucherRepository.create({
          code,
          type,
          config,
          expiresAt
      });

      try {
          if (type === VoucherType.MCOM_LOYALTY_TIER) {
              await this.provisionExternalLoyalty(mcomLoyaltyUrl, code, config, expiresAt);
          } else if (type === VoucherType.MCOM_MALL_TIER) {
              await this.provisionExternalMall(mcomMallUrl, code, config, expiresAt, 'TIER_ACCESS');
          } else if (type === VoucherType.MALL_OFFER) {
              await this.provisionExternalMall(mcomMallUrl, code, config, expiresAt, 'TRIAL_EXTENSION');
          }
      } catch (error) {
          this.logger.error(`Failed to provision single voucher ${code} for type ${type}`, error);
          throw error; // Re-throw so caller knows it failed
      }

      return this.voucherRepository.save(voucher);
  }

  private async provisionExternalLoyalty(baseUrl: string, code: string, config: any, expiresAt: Date) {
      // Config expected: { tierId: string, durationDays: number }
      // Map to Loyalty API Payload
      const payload = {
          code,
          type: 'TIER_ACCESS',
          payload: config,
          expiresAt: expiresAt.toISOString()
      };

      const response = await fetch(`${baseUrl}/provision`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              // 'Authorization': `Bearer ${process.env.S2S_SECRET}` // TODO: Add security
          },
          body: JSON.stringify(payload)
      });

      if (!response.ok) {
          const text = await response.text();
          throw new Error(`Loyalty API Error: ${response.status} ${text}`);
      }
  }

  private async provisionExternalMall(baseUrl: string, code: string, config: any, expiresAt: Date, type: string) {
      const payload = {
          code,
          type,
          payload: config,
          expiresAt: expiresAt.toISOString()
      };

      const response = await fetch(`${baseUrl}/provision`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
      });

      if (!response.ok) {
          const text = await response.text();
          throw new Error(`Mall API Error: ${response.status} ${text}`);
      }
  }

  async findAll() {
      return this.voucherRepository.find({ order: { created_at: 'DESC' } });
  }

  async redeem(code: string) {
      const voucher = await this.voucherRepository.findOne({ where: { code } });
      if (!voucher) throw new Error('Invalid voucher code');
      if (voucher.isRedeemed) throw new Error('Voucher already redeemed');
      if (new Date() > voucher.expiresAt) throw new Error('Voucher expired');

      // Mark as redeemed
      voucher.isRedeemed = true;
      voucher.redeemedAt = new Date();
      await this.voucherRepository.save(voucher);

      // Return the reward info
      return {
          type: voucher.type,
          reward: voucher.config,
          message: "Voucher redeemed successfully!"
      };
  }
}
