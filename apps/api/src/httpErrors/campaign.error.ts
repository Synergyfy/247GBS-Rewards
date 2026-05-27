import { HttpException, HttpStatus } from '@nestjs/common';

export class ErrorCreatingCampaign extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        error: 'There was an error creating this campaign',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class CampaignDoesntExistException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.NOT_FOUND,
        error: "This campaign doen'st exist",
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
