import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class ValidationException extends HttpException {
  constructor(validationErrors: ValidationError[] = []) {
    super(validationErrors, HttpStatus.BAD_REQUEST);
  }

  getResponse(): ValidationError[] {
    return super.getResponse() as ValidationError[];
  }
}
