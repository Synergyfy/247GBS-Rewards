import { HttpException, HttpStatus } from '@nestjs/common';

export class SegmentDoesntExistException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.NOT_FOUND,
        error: "This segment doen'st exist",
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
