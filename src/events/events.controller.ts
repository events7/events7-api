import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { EventsService } from './events.service';

@Controller({
  version: '1',
  path: '/api/events',
})
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiResponse({ status: 201, type: Event })
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [Event] })
  findAll(): Promise<Event[]> {
    // TODO: implement pagination
    return this.eventsService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: Event })
  async findOne(@Param('id') id: string): Promise<Event | null> {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: Event })
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, type: Event })
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
