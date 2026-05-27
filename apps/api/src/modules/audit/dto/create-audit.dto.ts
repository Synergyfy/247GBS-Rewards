import {
  IsOptional,
  IsObject,
  IsNotEmpty,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { PaymentStatus, PaymentType } from '../types/payment.enum';

export class CreateAuditDto {
  @ApiPropertyOptional({
    description: 'Audit data in JSON format',
    example: { action: 'create', entity: 'user', entityId: '1' },
  })
  @IsOptional()
  @IsObject()
  audit?: Record<string, any>;
}

export class CreateAuditPaymentHistoryDto {
  @ApiProperty({
    description: 'Status of the payment',
    enum: PaymentStatus,
    example: PaymentStatus.PENDING,
  })
  @IsNotEmpty()
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @ApiProperty({
    description: 'Type of the payment',
    enum: PaymentType,
    example: PaymentType.FRESH,
  })
  @IsNotEmpty()
  @IsEnum(PaymentType)
  type: PaymentType;

  @ApiProperty({
    description: 'Amount for autumn season',
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  autumn: number;

  @ApiProperty({
    description: 'Amount for spring season',
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  spring: number;

  @ApiProperty({
    description: 'Amount for winter season',
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  winter: number;

  @ApiProperty({
    description: 'Amount for summer season',
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  summer: number;
}
