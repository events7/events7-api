import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { EventType } from '../entities/event.entity';

export class UpdateEventDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  identification: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    enum: EventType,
  })
  @IsEnum(EventType)
  type: EventType;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(10)
  priority: number;
}
