import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  SuccessResponseTypeEventGetOne,
  SuccessResponseTypeEventPatch,
} from 'src/types/response-types.events';
import { DeleteResult } from 'typeorm';
import { SuccessResponseType } from '../../types/response-types';
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
    update: jest.fn((id: string, updateEventDto: Event): Promise<Event> => {
      if (eventMock.id === id) {
        const res: Event = {
          ...eventMock,
          ...updateEventDto,
          id,
        };
        return new Promise((resolve) => resolve(res));
      } else {
        return new Promise((resole, reject) => reject(new NotFoundException()));
      }
    }),

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
        const resMock: SuccessResponseTypeEventGetOne = {
          message: 'Event found successfully',
          success: true,
          data: eventMock,
        };
        expect(res).toEqual({
          ...resMock,
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
        const resMock: SuccessResponseTypeEventGetOne = {
          message: 'Event not found',
          success: false,
          data: null,
        };
        expect(res).toEqual({
          ...resMock,
        });
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
        const resMock: SuccessResponseTypeEventGetOne = {
          data: {
            ...eventMock,
            id: '2',
          },
          message: 'Event created successfully!',
          success: true,
        };
        expect(res).toEqual({
          ...resMock,
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
        const expected: SuccessResponseTypeEventPatch = {
          success: true,
          message: 'Event updated successfully',
          data: {
            ...eventMock,
            ...entry,
          },
        };
        expect(res).toEqual(expected);
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
        expect(res).toBeUndefined();
      })
      .catch((err) => {
        expect(err).toBeInstanceOf(NotFoundException);
      });
  });

  it('should delete an event', () => {
    controller
      .remove('1')
      .then((res) => {
        const expected: SuccessResponseType = {
          success: true,
          message: 'Event deleted successfully',
        };
        expect(res).toEqual(expected);
      })
      .catch((err) => {
        expect(err).toBeUndefined();
      });
  });

  it('should not delete an event', () => {
    controller
      .remove('2')
      .then((res) => {
        const expected: SuccessResponseType = {
          success: false,
          message: 'Event not deleted',
        };
        expect(res).toEqual(expected);
      })
      .catch((err) => {
        expect(err).toBeUndefined();
      });
  });
});
