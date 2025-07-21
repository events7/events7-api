import { ApiProperty } from '@nestjs/swagger';
import { Event } from '../api/events/entities/event.entity';
import { SuccessResponseType } from './response-types';

export class SuccessResponseTypeEventPost extends SuccessResponseType {
  @ApiProperty({
    type: Event,
  })
  data: Event;
}

export class SuccessResponseTypeEventPatch extends SuccessResponseType {
  @ApiProperty({
    type: Event,
  })
  data: Event;
}

export class SuccessResponseTypeEventGetOne extends SuccessResponseType {
  @ApiProperty({
    type: Event,
    nullable: true,
  })
  data: Event | null;
}

export class SuccessResponseTypeEventDelete extends SuccessResponseType {}
