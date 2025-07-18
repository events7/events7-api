import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import axios from 'axios';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Event, EventType } from '../entities/event.entity';

type IPApiResponse = {
  status: 'success' | 'fail';
  countryCode?: string;
};

@Injectable()
export class CreateEventGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // get body and check event type
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const body = context.switchToHttp().getRequest()?.body as Event;

    // just for more safe checking
    if (body == undefined) {
      return true;
    }

    // in case we have event type equal to "ads",
    // then we need to validate request by IP address
    // as required in documentation
    if (body.type == EventType.ADS) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const request = context.switchToHttp()?.getRequest() as Request;

      // extract and check ip address
      if (request != undefined && request.ips != undefined) {
        // extract ip
        const ip = request.ips.length ? request.ips[0] : request.ip;

        // break if for some reason ip is not available
        if (ip == undefined) {
          return false;
        }

        // otherwise validate the ip address
        return this.validateIpAddressForAdsEvent(ip);
      }

      // in case for some reason ip address is not available
      // then reject request
      return false;
    }

    // otherwise allow request to pass
    return true;
  }

  private async validateIpAddressForAdsEvent(ip: string) {
    try {
      // TODO: hardcoded ip for easier testing on localhost
      // ping ip-api which will respond with country code
      const response = await axios.get(
        `http://ip-api.com/json/${ip === '::1' ? '193.77.212.29' : ip}?fields=16386`,
      );

      // extract data and check status
      const data = response.data as IPApiResponse;

      // if failed to get country then reject
      if (data.status == 'fail' || data.countryCode == undefined) {
        return false;
      }

      // otherwise check if provided country is
      // allowed to make request
      return this.checkCountryPermission(data.countryCode);
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  private async checkCountryPermission(countryCode: string) {
    // prepare api url
    const url = process.env.EXTERNAL_API_URL;

    if (url == undefined) {
      return false;
    }

    try {
      // make request
      const response = await axios.get(url, {
        params: { countryCode },
        auth: {
          username: process.env.EXTERNAL_API_USERNAME as string,
          password: process.env.EXTERNAL_API_PASSWORD as string,
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const adsResponse = response.data?.ads;

      // Interpret the result
      return adsResponse === 'sure, why not!';
    } catch (error) {
      console.error('Error:', error);

      return false;
    }
  }
}
