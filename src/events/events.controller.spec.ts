import { Test, TestingModule } from '@nestjs/testing';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { Event, EventType } from './entities/event.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

const event: Event = {
  id: '1',
  name: 'Lorem',
  type: EventType.APP,
  createdAt: new Date(),
  updatedAt: new Date(),
  description: 'Ipsum',
  priority: 1,
};

describe('EventsController', () => {
  let controller: EventsController;

  const eventServiceMock = {
    findAll: jest.fn((): Promise<Event[]> => {
      return new Promise((resolve) => resolve([]));
    }),
    findOne: jest.fn((id: string): Promise<Event | null> => {
      return new Promise((resolve) => resolve(event.id == id ? event : null));
    }),
    create: jest.fn((createEventDto: CreateEventDto): Promise<Event> => {
      return new Promise((resolve) =>
        resolve({
          ...event,
          ...createEventDto,
          id: '2',
        }),
      );
    }),
    update: jest.fn(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (id: string, updateEventDto: Event): Promise<UpdateResult> => {
        const res: UpdateResult = {
          generatedMaps: [event],
          raw: [event],
          affected: 1,
        };
        return new Promise((resolve) => resolve(res));
      },
    ),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    remove: jest.fn((id: string): Promise<DeleteResult> => {
      const res: DeleteResult = {
        raw: [event],
        affected: 1,
      };
      return new Promise((resolve) => resolve(res));
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [EventsService],
    })
      .overrideProvider(EventsService)
      .useValue(eventServiceMock)
      .compile();

    controller = module.get<EventsController>(EventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an empty array', () => {
    controller
      .findAll()
      .then((res) => {
        expect(res).toEqual([]);
      })
      .catch((err) => {
        expect(err).toBeUndefined();
      });
  });

  it('should return an event entry', () => {
    controller
      .findOne('1')
      .then((res) => {
        expect(res).toEqual({
          ...event,
        });
      })
      .catch((err) => {
        expect(err).toBeUndefined();
      });
  });

  it('should return null', () => {
    controller
      .findOne('2')
      .then((res) => {
        expect(res).toBeNull();
      })
      .catch((err) => {
        expect(err).toBeUndefined();
      });
  });

  it('should create an event', () => {
    controller
      .create({
        name: event.name,
        type: event.type,
        description: event.description,
        priority: event.priority,
      })
      .then((res) => {
        expect(res).toEqual({
          ...event,
          id: '2',
        });
      })
      .catch((err) => {
        expect(err).toBeUndefined();
      });
  });

  it('should update an event', () => {
    controller
      .update('1', {
        name: event.name,
        type: event.type,
        description: event.description,
        priority: event.priority,
      })
      .then((res) => {
        expect(res).toEqual({
          generatedMaps: [event],
          raw: [event],
          affected: 1,
        });
      })
      .catch((err) => {
        expect(err).toBeUndefined();
      });
  });

  it('should delete an event', () => {
    controller
      .remove('1')
      .then((res) => {
        expect(res).toEqual({
          raw: [event],
          affected: 1,
        });
      })
      .catch((err) => {
        expect(err).toBeUndefined();
      });
  });
});
