import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { AbstractBaseEntity } from "../../../entities/base.entity";

export enum VoucherType {
  LINK = "LINK",
  CREDENTIALS = "CREDENTIALS",
  MCOM_LOYALTY_TIER = "MCOM_LOYALTY_TIER",
  MCOM_MALL_TIER = "MCOM_MALL_TIER",
  MALL_OFFER = "MALL_OFFER"
}

@Entity()
export class Voucher extends AbstractBaseEntity {
  @Column({ unique: true })
  code: string;

  @Column({ type: "enum", enum: VoucherType })
  type: VoucherType;

  @Column("jsonb", { nullable: true })
  config: any;

  @Column({ default: false })
  isRedeemed: boolean;

  @Column({ nullable: true })
  redeemedAt: Date;

  @Column()
  expiresAt: Date;
}
