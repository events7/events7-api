import { BadRequestException } from '@nestjs/common';

export const handleDatabaseErrors = (error: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (error.code === '23505' || error.code === '22P02') {
    throw new BadRequestException('Invalid UUID format');
  }
};
