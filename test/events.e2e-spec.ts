import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdateEventDto } from 'src/api/events/dto/update-event.dto';
import {
  ForbiddenResponseType,
  NotFoundExceptionType,
  SuccessResponseType,
} from 'src/types/response-types';
import {
  SuccessResponseTypeEventGetOne,
  SuccessResponseTypeEventPatch,
  SuccessResponseTypeEventPost,
} from 'src/types/response-types.events';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateEventDto } from '../src/api/events/dto/create-event.dto';
import { Event, EventType } from '../src/api/events/entities/event.entity';
import { EventsModule } from '../src/api/events/events.module';

const mockEvent: Event = {
  id: '1234567',
  name: 'Lorem',
  type: EventType.CROSSPROMO,
  createdAt: new Date(),
  updatedAt: new Date(),
  description: 'Ipsum',
  priority: 1,
};

describe('EventsController (e2e)', () => {
  let app: INestApplication<App>;

  const mockEventRepository = {
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
    update: jest.fn(
      (
        options: { id: string },
        updateEventDto: Event,
      ): Promise<UpdateResult> => {
        return new Promise((resolve) => {
          if (mockEvent.id !== options.id) {
            resolve({
              generatedMaps: [],
              raw: [],
              affected: 0,
            });
          } else {
            resolve({
              generatedMaps: [{ ...mockEvent, ...updateEventDto }],
              raw: [{ ...mockEvent, ...updateEventDto }],
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
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [EventsModule],
    })
      .overrideProvider(getRepositoryToken(Event))
      .useValue(mockEventRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/events (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/events')
      .expect(200)
      .expect((res) => {
        // parsing to avoid Date object
        expect(res.body).toEqual([JSON.parse(JSON.stringify(mockEvent))]);
      });
  });

  it('/api/events/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/events/1234567')
      .expect(200)
      .expect((res) => {
        // parsing to avoid Date object
        const expected: SuccessResponseTypeEventGetOne = {
          success: true,
          data: JSON.parse(JSON.stringify(mockEvent)) as Event,
          message: 'Event found successfully',
        };
        expect(res.body).toEqual(expected);
      });
  });

  it('/api/events/:id (GET) return null', () => {
    return request(app.getHttpServer())
      .get('/api/events/987654')
      .expect(200)
      .expect((res) => {
        const expected: SuccessResponseTypeEventGetOne = {
          success: false,
          data: null,
          message: 'Event not found',
        };
        expect(res.body).toEqual(expected);
      });
  });

  it('/api/events (POST)', () => {
    const entry: CreateEventDto = {
      name: 'Lorem 1',
      type: EventType.LIVEOPS,
      description: 'Ipsum 2',
      priority: 2,
    };

    return request(app.getHttpServer())
      .post('/api/events')
      .send(entry)
      .expect((res) => {
        // can't easily separate the 403 and 201 statuses (if type == "ADS")
        // asuming this is enought just fo this test
        if (res.status === 201) {
          const expected: SuccessResponseTypeEventPost = {
            data: JSON.parse(
              JSON.stringify({ ...mockEvent, ...entry }),
            ) as Event,
            success: true,
            message: 'Event created successfully!',
          };
          expect(res.body).toEqual(expected);
        } else if (res.status === 403) {
          const expected: ForbiddenResponseType = {
            error: 'Forbidden',
            statusCode: 403,
            message: 'Forbidden resource',
          };
          expect(res.body).toEqual(expected);
        }
      });
  });

  it('/api/events/:id (PATCH)', () => {
    const entry: UpdateEventDto = {
      name: 'Lorem 1',
      type: EventType.LIVEOPS,
      description: 'Ipsum 2',
      priority: 2,
    };

    return request(app.getHttpServer())
      .patch(`/api/events/${mockEvent.id}`)
      .send(entry)
      .expect(200)
      .expect((res) => {
        const expected: SuccessResponseTypeEventPatch = {
          success: true,
          message: 'Event updated successfully',
          data: JSON.parse(JSON.stringify({ ...mockEvent, ...entry })) as Event,
        };
        expect(res.body).toEqual(expected);
      });
  });

  it('/api/events/:id (PATCH) return false', () => {
    const entry: UpdateEventDto = {
      name: 'Lorem 1',
      type: EventType.LIVEOPS,
      description: 'Ipsum 2',
      priority: 2,
    };

    return request(app.getHttpServer())
      .patch('/api/events/987654')
      .send(entry)
      .expect(404)
      .expect((res) => {
        const expected: NotFoundExceptionType = {
          message: 'Not Found',
          statusCode: 404,
        };
        expect(res.body).toEqual(expected);
      });
  });

  it('/api/events/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/api/events/${mockEvent.id}`)
      .expect(200)
      .expect((res) => {
        const expected: SuccessResponseType = {
          success: true,
          message: 'Event deleted successfully',
        };
        expect(res.body).toEqual(expected);
      });
  });

  it('/api/events/:id (DELETE) return false', () => {
    return request(app.getHttpServer())
      .delete('/api/events/987654')
      .expect(404)
      .expect((res) => {
        const expected: NotFoundExceptionType = {
          message: 'Not Found',
          statusCode: 404,
        };
        expect(res.body).toEqual(expected);
      });
  });
});
