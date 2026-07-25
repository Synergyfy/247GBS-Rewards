import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessDoesNotExistException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        error: 'The business does not exist',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
