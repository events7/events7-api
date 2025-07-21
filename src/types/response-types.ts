import { ApiProperty } from '@nestjs/swagger';

export class ForbiddenResponseType {
  @ApiProperty()
  statusCode: number = 403;

  @ApiProperty()
  message: 'Forbidden resource';

  @ApiProperty()
  error: 'Forbidden';
}

class BadRequestResponseTypeError {
  @ApiProperty()
  field: string;

  @ApiProperty({ type: [String] })
  errors: string[];
}

export class BadRequestResponseType {
  @ApiProperty({
    type: Number,
    default: 400,
  })
  statusCode: number = 400;

  @ApiProperty({
    type: String,
  })
  message: string;

  @ApiProperty({ type: [BadRequestResponseTypeError] })
  errors: BadRequestResponseTypeError[];
}

export class SuccessResponseType {
  @ApiProperty({
    type: Boolean,
  })
  success: boolean;

  @ApiProperty({
    type: String,
  })
  message: string;
}

export class NotFoundExceptionType {
  @ApiProperty({
    type: String,
    default: 'Entry not found',
  })
  message: string;

  @ApiProperty({
    type: Number,
    default: 404,
  })
  statusCode: number;
}
