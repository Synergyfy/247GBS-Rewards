import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailExistException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        error: 'Email already exists',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class LoginIdExistException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        error: 'Login ID already exists',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class PhoneNumberExistException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        error: 'Phone number already exists',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class UserDoesNotExistException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.NOT_FOUND,
        error: 'User does not exist',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class AccountSetupException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.FORBIDDEN,
        error: 'User account already setup',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

export class InCorrectPasswordException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.UNAUTHORIZED,
        error: 'Incorrect password',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class PasswordFieldsDontMatch extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        error: 'Password fields do not match',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class UploadFileException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        error: 'Excel file to create users from is missing',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class OtpErrorException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        error: 'Invalid OTP',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class CompanyMailErrorException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        error: 'Invalid Company Mail',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class FileDoesntExistException extends HttpException {
  constructor(fileId: string) {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        error: `File with ID ${fileId} already exists`,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class CoursePackageUpdateDeclineException extends HttpException {
  constructor(courseId: string) {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        error: `You don't have permission to update course package with ID ${courseId}`,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class SSOEntryDoesNotExistException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        error: 'Invalid login',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
