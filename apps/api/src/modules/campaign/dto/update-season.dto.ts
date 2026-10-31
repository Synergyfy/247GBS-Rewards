import { PartialType } from '@nestjs/swagger';
import { CreateSeasonDto } from './create-season.dto.js';

export class UpdateSeasonDto extends PartialType(CreateSeasonDto) {}
