import { HttpException, HttpStatus } from '@nestjs/common';

export class StaffEmailException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        error: 'This email has been used by another staff',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class StaffDoesntExistException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        error: 'This staff does not exist',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
