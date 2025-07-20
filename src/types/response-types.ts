import { ApiProperty } from '@nestjs/swagger';

export class ForbiddenResponseType {
  @ApiProperty()
  statusCode: number = 403;

  @ApiProperty()
  message: 'Forbidden';

  @ApiProperty()
  error: 'Forbidden';
}

export class BadRequestResponseType {
  @ApiProperty({
    type: Number,
  })
  statusCode: number = 400;

  @ApiProperty({
    type: [String],
  })
  message: string[];

  @ApiProperty({ type: String })
  error: string;
}

export class SuccessResponseType {
  @ApiProperty({
    type: Boolean,
  })
  success: boolean;
}
