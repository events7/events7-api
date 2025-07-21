import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { Event, EventType } from './entities/event.entity';
import { EventsService } from './events.service';

const mockEvent: Event = {
  identification: '1',
  id: '1234567',
  name: 'Lorem',
  type: EventType.APP,
  createdAt: new Date(),
  updatedAt: new Date(),
  description: 'Ipsum',
  priority: 1,
};

describe('EventsService', () => {
  let service: EventsService;

  const mockEventRepository = {
    save: jest.fn(
      (createEventDto: CreateEventDto): Promise<CreateEventDto & Event> => {
        return new Promise((resolve) =>
          resolve({
            ...mockEvent,
            ...createEventDto,
          }),
        );
      },
    ),
    find: jest.fn((): Promise<Event[]> => {
      return new Promise((resolve) => resolve([mockEvent]));
    }),
    findOne: jest.fn(
      (options: { where: { id: string } }): Promise<Event | null> => {
        return new Promise((resolve) =>
          resolve(mockEvent.id == options.where.id ? mockEvent : null),
        );
      },
    ),
    update: jest.fn(
      (
        options: { id: string },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        updateEventDto: Event,
      ): Promise<UpdateResult> => {
        return new Promise((resolve) => {
          if (mockEvent.id !== options.id) {
            return resolve({
              raw: [],
              affected: 0,
              generatedMaps: [],
            });
          } else {
            resolve({
              generatedMaps: [mockEvent],
              raw: [mockEvent],
              affected: 1,
            });
          }
        });
      },
    ),
    delete: jest.fn((options: { id: string }): Promise<DeleteResult> => {
      return new Promise((resolve) => {
        if (mockEvent.id !== options.id) {
          return resolve({
            raw: [],
            affected: 0,
          });
        } else {
          resolve({
            raw: [mockEvent],
            affected: 1,
          });
        }
      });
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: mockEventRepository,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an event', async () => {
    const entry: CreateEventDto = {
      identification: '1',
      name: 'Lorem 1',
      type: EventType.APP,
      description: 'Ipsum 2',
      priority: 2,
    };
    const event = await service.create(entry);
    expect(event).toEqual({
      ...mockEvent,
      ...entry,
    });
  });

  it('should find all events', async () => {
    const events = await service.findAll();
    expect(events).toEqual([mockEvent]);
  });

  it('should find one event', async () => {
    const event = await service.findOne(mockEvent.id);
    expect(event).toEqual(mockEvent);
  });

  it('should not find one event', async () => {
    const event = await service.findOne('9876543');
    expect(event).toBeNull();
  });

  it('should update an event', async () => {
    const event = await service.update(mockEvent.id, mockEvent);

    expect(event).toEqual({
      ...mockEvent,
      id: mockEvent.id,
    });
  });

  it('should not update an event', async () => {
    try {
      await service.update('9876543', mockEvent);

      // expect to not come here
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });

  it('should delete an event', async () => {
    const event = await service.remove(mockEvent.id);
    expect(event).toEqual({
      raw: [mockEvent],
      affected: 1,
    });
  });

  it('should not delete an event', async () => {
    try {
      await service.remove('9876543');

      // expect to not come here
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });
});
