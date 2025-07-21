import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  create(createEventDto: CreateEventDto) {
    return this.eventRepository.save(createEventDto);
  }

  findAll() {
    return this.eventRepository.find({});
  }

  findOne(id: string) {
    return this.eventRepository.findOne({ where: { id } });
  }

  update(id: string, updateEventDto: UpdateEventDto) {
    return this.eventRepository.save({ id, ...updateEventDto });
  }

  remove(id: string) {
    return this.eventRepository.delete({ id });
  }
}
