import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { BadRequestResponseType } from 'src/types/response-types';

export const customValidationPipe = new ValidationPipe({
  exceptionFactory: (errors) => {
    const customErrors = errors.map((error) => ({
      field: error.property,
      errors: Object.values(error.constraints || {}),
    }));

    const res: BadRequestResponseType = {
      statusCode: 400,
      message: 'Validation failed',
      errors: customErrors,
    };
    return new BadRequestException(res);
  },
});
