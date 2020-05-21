import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { DuplicatePlusBaseExceptionFilter } from './duplicate-plus-base-exception.filter';
import { NotFoundInterceptor } from './not-found.interceptor';

@Module({
    providers: [
        { provide: APP_PIPE, useClass: ValidationPipe },
        { provide: APP_FILTER, useClass: DuplicatePlusBaseExceptionFilter },
        { provide: APP_INTERCEPTOR, useClass: NotFoundInterceptor },
    ],
})
export class UtilsModule {}
