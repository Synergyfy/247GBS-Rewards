import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { SkipAuth } from './core/decorators/skipAuth.decorator.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @SkipAuth()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
