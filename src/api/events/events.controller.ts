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
  NotFoundExceptionType,
} from '../../types/response-types';
import {
  SuccessResponseTypeEventDelete,
  SuccessResponseTypeEventGetOne,
  SuccessResponseTypeEventPatch,
  SuccessResponseTypeEventPost,
} from '../../types/response-types.events';
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
    type: SuccessResponseTypeEventPost,
    description: 'Event created successfully.',
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
  async create(
    @Body() createEventDto: CreateEventDto,
  ): Promise<SuccessResponseTypeEventPost> {
    try {
      const res: SuccessResponseTypeEventPost = {
        message: 'Event created successfully!',
        success: true,
        data: await this.eventsService.create(createEventDto),
      };

      return res;
    } catch (error) {
      console.error(error);
      throw error;
    }
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
    type: SuccessResponseTypeEventGetOne,
    description: 'Returns the event if found or null if not found',
  })
  @ApiResponse({
    status: 400,
    type: BadRequestResponseType,
    description:
      'Bad request. Usually triggered if the request body or provided parameter is not valid',
  })
  async findOne(
    @Param('id') id: string,
  ): Promise<SuccessResponseTypeEventGetOne> {
    try {
      const exists = await this.eventsService.findOne(id);

      const res: SuccessResponseTypeEventGetOne = {
        message: exists ? 'Event found successfully' : 'Event not found',
        success: exists ? true : false,
        data: exists,
      };

      return res;
    } catch (error) {
      handleDatabaseErrors(error);

      console.error(error);
      throw error;
    }
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    type: SuccessResponseTypeEventPatch,
    description: 'Updates an event.',
  })
  @ApiResponse({
    status: 400,
    type: BadRequestResponseType,
    description:
      'Bad request. Usually triggered if the request body or provided parameter is not valid',
  })
  @ApiResponse({
    status: 404,
    type: NotFoundExceptionType,
    description: 'Entry not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<SuccessResponseTypeEventPatch> {
    try {
      const result = await this.eventsService.update(id, updateEventDto);

      return {
        success: true,
        message: 'Event updated successfully',
        data: result,
      };
    } catch (error) {
      handleDatabaseErrors(error);

      throw error;
    }
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    type: SuccessResponseTypeEventDelete,
    description: 'Returns true if deleted successfully',
  })
  @ApiResponse({
    status: 400,
    type: BadRequestResponseType,
    description:
      'Bad request. Usually triggered if the request body or provided parameter is not valid',
  })
  @ApiResponse({
    status: 404,
    type: NotFoundExceptionType,
    description: 'Entry not found',
  })
  async remove(
    @Param('id') id: string,
  ): Promise<SuccessResponseTypeEventDelete> {
    try {
      await this.eventsService.remove(id);

      return {
        success: true,
        message: 'Event deleted successfully',
      };
    } catch (error) {
      handleDatabaseErrors(error);

      throw error;
    }
  }
}
