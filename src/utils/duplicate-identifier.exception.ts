import { HttpException } from '@nestjs/common';

export class DuplicateIdentifierException extends HttpException {
    constructor(repeatedId: string) {
        super(repeatedId, 303);
    }
}
