import { BadRequestException } from '@nestjs/common';
import { BadRequestResponseType } from 'src/types/response-types';

export const handleDatabaseErrors = (error: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (error.code === '22P02' || error.code === '23503') {
    throw new BadRequestException('Invalid UUID format');
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (error.code === '23505') {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unnecessary-type-assertion
    const fieldName = (error as any).detail.match(/Key \((.*?)\)=/)[1];

    const res: BadRequestResponseType = {
      statusCode: 400,
      message: 'Validation failed',
      errors: [
        {
          field: fieldName as string,
          errors: [`Please select another value. This value already exists`],
        },
      ],
    };
    throw new BadRequestException(res);
  }
};
