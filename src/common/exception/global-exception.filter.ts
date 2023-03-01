import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpResponse } from '../types/http.response';
import { ScrapperException } from './scrapper-exception';
import { ValidationError } from 'class-validator';
import { ValidationException } from './validation-exception';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';

export const getStatusCode = (exception: unknown): number => {
  return exception instanceof HttpException
    ? exception.getStatus()
    : HttpStatus.INTERNAL_SERVER_ERROR;
};

export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SCRAPPER_ERROR = 'SCRAPPER_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}

export const getErrorMessage = (exception: unknown): string => {
  return String(exception);
};

export const getValidationErrors = (
  exception: ValidationException,
  errorCode: number,
) => {
  const errors = [];

  exception.getResponse().map((error: ValidationError) => {
    errors.push({
      property: error.property,
      error: error.constraints,
    });
  });

  return {
    code: errorCode,
    errorType: ErrorType.VALIDATION_ERROR,
    messages: errors,
  };
};

@Catch()
export class GlobalExceptionFilter extends BaseExceptionFilter {
  private readonly successCodes = [200, 201, 204];

  catch(exception: Error, host: ArgumentsHost) {
    const logger = new Logger(this.constructor.name);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const code = getStatusCode(exception);

    if (exception instanceof ScrapperException) {
      const customResponse = new HttpResponse({
        data: {
          code,
          errorType: ErrorType.SCRAPPER_ERROR,
          messages: [exception.message],
        },
        success: this.successCodes.includes(code),
      });

      if (exception.loggable()) {
        logger.error(
          ErrorType.SCRAPPER_ERROR + ': ' + exception.message,
          exception.stack,
        );
      }

      response.status(code).send(customResponse.getResponse());
    } else if (exception instanceof ValidationException) {
      const customResponse = new HttpResponse({
        data: getValidationErrors(exception, code),
        success: this.successCodes.includes(code),
      });

      response.status(code).send(customResponse.getResponse());
    } else {
      super.catch(exception, host);
    }
  }
}
