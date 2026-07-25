import { HttpException, HttpStatus } from '@nestjs/common';

export class CampaignInactiveException extends HttpException {
  constructor() {
    super('This campaign is currently inactive', HttpStatus.BAD_REQUEST);
  }
}
