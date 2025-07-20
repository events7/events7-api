import { Test, TestingModule } from '@nestjs/testing';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { Event, EventType } from './entities/event.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

const eventMock: Event = {
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
      return new Promise((resolve) =>
        resolve(eventMock.id == id ? eventMock : null),
      );
    }),
    create: jest.fn((createEventDto: CreateEventDto): Promise<Event> => {
      return new Promise((resolve) =>
        resolve({
          ...eventMock,
          ...createEventDto,
          id: '2',
        }),
      );
    }),
    update: jest.fn(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (id: string, updateEventDto: Event): Promise<UpdateResult> => {
        if (eventMock.id !== id) {
          const res: UpdateResult = {
            generatedMaps: [],
            raw: [],
            affected: 0,
          };
          return new Promise((resolve) => resolve(res));
        } else {
          const res: UpdateResult = {
            generatedMaps: [{ ...eventMock, ...updateEventDto }],
            raw: [{ ...eventMock, ...updateEventDto }],
            affected: 1,
          };
          return new Promise((resolve) => resolve(res));
        }
      },
    ),

    remove: jest.fn((id: string): Promise<DeleteResult> => {
      if (eventMock.id !== id) {
        const res: DeleteResult = {
          raw: [],
          affected: 0,
        };
        return new Promise((resolve) => resolve(res));
      } else {
        const res: DeleteResult = {
          raw: [eventMock],
          affected: 1,
        };
        return new Promise((resolve) => resolve(res));
      }
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
          ...eventMock,
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
        name: eventMock.name,
        type: eventMock.type,
        description: eventMock.description,
        priority: eventMock.priority,
      })
      .then((res) => {
        expect(res).toEqual({
          ...eventMock,
          id: '2',
        });
      })
      .catch((err) => {
        expect(err).toBeUndefined();
      });
  });

  it('should update an event', () => {
    const entry: CreateEventDto = {
      name: 'Lorem 1234',
      type: EventType.LIVEOPS,
      description: 'Ipsum 2',
      priority: 2,
    };
    controller
      .update('1', {
        name: entry.name,
        type: entry.type,
        description: entry.description,
        priority: entry.priority,
      })
      .then((res) => {
        expect(res).toEqual({
          generatedMaps: [{ ...eventMock, ...entry }],
          raw: [{ ...eventMock, ...entry }],
          affected: 1,
        });
      })
      .catch((err) => {
        expect(err).toBeUndefined();
      });
  });

  it('should not update an event', () => {
    controller
      .update('2', {
        name: eventMock.name,
        type: eventMock.type,
        description: eventMock.description,
        priority: eventMock.priority,
      })
      .then((res) => {
        expect(res).toEqual({
          generatedMaps: [],
          raw: [],
          affected: 0,
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
          raw: [eventMock],
          affected: 1,
        });
      })
      .catch((err) => {
        expect(err).toBeUndefined();
      });
  });

  it('should not delete an event', () => {
    controller
      .remove('2')
      .then((res) => {
        expect(res).toEqual({
          raw: [],
          affected: 0,
        });
      })
      .catch((err) => {
        expect(err).toBeUndefined();
      });
  });
});
