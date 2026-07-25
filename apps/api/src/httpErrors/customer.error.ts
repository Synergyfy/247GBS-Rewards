import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomerEmailExistException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        error: 'A user has used this email',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
