import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { handleDatabaseErrors } from '../../helpers/handleDatabaseErrors';
import {
  BadRequestResponseType,
  ForbiddenResponseType,
  SuccessResponseType,
} from '../../types/response-types';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { EventsService } from './events.service';
import { CreateEventGuard } from './guards/create-event.guard';

@Controller({
  version: '1',
  path: '/api/events',
})
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiResponse({
    status: 201,
    type: Event,
    description: 'Event created successfully. Returns the created event',
  })
  @ApiResponse({
    status: 400,
    type: BadRequestResponseType,
    description:
      'Bad request. Usually triggered if the request body or provided parameter is not valid',
  })
  @ApiResponse({
    status: 403,
    type: ForbiddenResponseType,
    description:
      'Forbidden resource. Try again later or check with adminstrators that you have correct permissions',
  })
  @UseGuards(CreateEventGuard)
  create(@Body() createEventDto: CreateEventDto): Promise<Event> {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [Event] })
  findAll(): Promise<Event[]> {
    // TODO: implement pagination
    return this.eventsService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: Event,
    description: 'Event found. Returns the event',
  })
  @ApiResponse({
    status: 400,
    type: BadRequestResponseType,
    description:
      'Bad request. Usually triggered if the request body or provided parameter is not valid',
  })
  async findOne(@Param('id') id: string): Promise<Event | null> {
    try {
      const exists = await this.eventsService.findOne(id);

      return exists;
    } catch (error) {
      handleDatabaseErrors(error);

      console.error(error);
      throw error;
    }
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    type: SuccessResponseType,
    description: 'Returns true if updated successfully',
  })
  @ApiResponse({
    status: 400,
    type: BadRequestResponseType,
    description:
      'Bad request. Usually triggered if the request body or provided parameter is not valid',
  })
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<SuccessResponseType> {
    try {
      const result = await this.eventsService.update(id, updateEventDto);

      return { success: result.affected != undefined && result.affected > 0 };
    } catch (error) {
      handleDatabaseErrors(error);

      console.error(error);
      throw error;
    }
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    type: SuccessResponseType,
    description: 'Returns true if deleted successfully',
  })
  @ApiResponse({
    status: 400,
    type: BadRequestResponseType,
    description:
      'Bad request. Usually triggered if the request body or provided parameter is not valid',
  })
  async remove(@Param('id') id: string): Promise<SuccessResponseType> {
    try {
      const success = await this.eventsService.remove(id);

      return { success: success.affected != undefined && success.affected > 0 };
    } catch (error) {
      handleDatabaseErrors(error);

      console.error(error);
      throw error;
    }
  }
}
