import { Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { DuplicateIdentifierException } from './duplicate-identifier.exception';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class DuplicatePlusBaseExceptionFilter extends BaseExceptionFilter {

    catch(exception: unknown, host: ArgumentsHost) {
        if (exception instanceof DuplicateIdentifierException) {
            const ctx = host.switchToHttp();
            const response = ctx.getResponse<Response>();
            const request = ctx.getRequest<Request>();
            const status = exception.getStatus();
            response.redirect(status,`${request.url}/${exception.message}`)
        }
        else {
            super.catch(exception, host);
        }
    }
}
