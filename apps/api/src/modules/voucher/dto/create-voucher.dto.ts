import { IsEnum, IsInt, IsNotEmpty, IsObject, IsOptional, IsString, Min } from "class-validator";
import { VoucherType } from "../entities/voucher.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateVoucherBatchDto {
  @ApiProperty({ enum: VoucherType })
  @IsEnum(VoucherType)
  type: VoucherType;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(1)
  count: number;

  @ApiProperty({ example: { tierId: "gold", durationDays: 45 } })
  @IsObject()
  config: any;

  @ApiProperty({ example: 30 })
  @IsInt()
  validityDays: number;
}
