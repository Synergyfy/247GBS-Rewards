import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSegmentDto {
  @ApiProperty({
    description: 'Name of the segment',
    example: 'Retail',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'ID of the business the segment belongs to',
    example: '1',
  })
  @IsNotEmpty()
  businessId: string;
}
