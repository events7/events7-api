import { ExecutionContext } from '@nestjs/common';
import { CreateEventDto } from '../dto/create-event.dto';
import { EventType } from '../entities/event.entity';
import { CreateEventGuard } from './create-event.guard';

describe('CreateEventGuard', () => {
  let guard: CreateEventGuard;

  beforeEach(() => {
    guard = new CreateEventGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should not allow request if event body is undefined', async () => {
    const res = await guard.canActivate({
      switchToHttp: () => ({ getRequest: () => undefined }),
    } as ExecutionContext);

    expect(res).toBe(false);
  });

  it('should allow request if event type is not "ads"', async () => {
    const entry: CreateEventDto = {
      name: 'Lorem 1',
      type: EventType.APP,
      description: 'Ipsum 2',
      priority: 2,
    };

    const types = Object.values(EventType).filter(
      (value) => value !== EventType.ADS,
    );

    const options = types.map((type) => {
      const createDto: CreateEventDto = { ...entry, type: type as EventType };

      const context: any = {
        switchToHttp: () => ({
          getRequest: () => ({ body: createDto }),
        }),
        body: createDto,
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return context;
    });

    for (const option of options) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await guard.canActivate(option);

      expect(res).toBe(true);
    }
  });

  it('should validate request IP address if event type is "ads"', async () => {
    const request = { ip: '127.0.0.1', ips: [] };
    const spy = jest.spyOn(guard, 'validateIpAddressForAdsEvent');
    const createDto: CreateEventDto = {
      description: 'Ipsum',
      name: 'Lorem',
      priority: 1,
      type: EventType.ADS,
    };

    const context: any = {
      switchToHttp: () => ({
        getRequest: () => ({ body: createDto, ...request }),
      }),
      body: createDto,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await guard.canActivate(context);
    expect(spy).toHaveBeenCalledWith(request.ip);
  });

  it('should reject request if event type is "ads" and IP address is not available', async () => {
    const request = { ip: undefined, ips: [] };
    const spy = jest.spyOn(guard, 'validateIpAddressForAdsEvent');
    const createDto: CreateEventDto = {
      description: 'Ipsum',
      name: 'Lorem',
      priority: 1,
      type: EventType.ADS,
    };

    const context: any = {
      switchToHttp: () => ({
        getRequest: () => ({ body: createDto, ...request }),
      }),
      body: createDto,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await guard.canActivate(context);
    expect(spy).not.toHaveBeenCalled();
  });

  // NOTE: Anything else that is being called after type is ADS
  // NOTE: and IP address is available is not idempotent and
  // NOTE: depends on the response of external API-es
});
