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
import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import { DeleteResult, ObjectLiteral, UpdateResult } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { EventsService } from './events.service';
import { CreateEventGuard } from './guards/create-event.guard';

/**
 * Used for typing the response after update for swagger
 */
class UpdateResultExtended extends UpdateResult {
  @ApiProperty()
  declare affected: number;

  @ApiProperty()
  declare raw: any;

  @ApiProperty()
  declare generatedMaps: ObjectLiteral[];
}

/**
 * Used for typing the response after delete for swagger
 */
class DeleteResultExtended extends DeleteResult {
  @ApiProperty()
  declare affected: number;

  @ApiProperty()
  declare raw: any;
}

@Controller({
  version: '1',
  path: '/api/events',
})
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiResponse({ status: 201, type: Event })
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
  @ApiResponse({ status: 200, type: Event })
  async findOne(@Param('id') id: string): Promise<Event | null> {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: UpdateResultExtended })
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<UpdateResult> {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, type: DeleteResultExtended })
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.eventsService.remove(id);
  }
}
