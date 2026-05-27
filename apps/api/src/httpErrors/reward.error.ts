import { HttpException, HttpStatus } from '@nestjs/common';

export class RewardDoesntExistException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.NOT_FOUND,
        error: "This reward doen'st exist",
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class CodeDoesntExistException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.NOT_FOUND,
        error: "Code doesn't exist or expired",
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
export class InsufficientBalanceException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.NOT_FOUND,
        error: 'Insufficient point balance to redeem this reward',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
