import { HttpStatus } from '@nestjs/common';
import { getSchemaPath } from '@nestjs/swagger';
import { ErrorType } from '../exception/global-exception.filter';

export interface IResponse<T> {
  success: boolean;
  data: T;
}

export class HttpResponse<T> {
  private readonly data: T;
  private readonly success: boolean;
  private readonly status: HttpStatus;

  constructor({
    data,
    success,
    status = HttpStatus.OK,
  }: {
    data?: T;
    success?: boolean;
    status?: HttpStatus;
  }) {
    this.data = data;
    this.success = success;
    this.status = status;
  }

  getResponse(): IResponse<T> {
    const payload = {
      success: this.success,
      data: this.data,
    };

    if (payload.success === undefined && payload.data === undefined) {
      return undefined;
    }

    return payload;
  }

  getStatus(): HttpStatus {
    return this.status;
  }
}

export class SuccessResponse {
  static getSchema(options?: { payload: unknown; isArray?: boolean }) {
    let payload;

    if (!options) {
      return {
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
        },
      };
    } else if (typeof options.payload === 'function') {
      payload = {
        $ref: getSchemaPath(options.payload),
      };
    } else {
      payload = options.payload;
    }

    const schema = {
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
      },
    };
    if (options.isArray) {
      schema.properties['data'] = {
        type: 'array',
        items: payload,
      };
    } else {
      schema.properties['data'] = payload;
    }
    return schema;
  }
}

export class ErrorResponse {
  static getSchema(options: { errorType: ErrorType; message?: string }) {
    const payload = {
      properties: {
        success: {
          type: 'boolean',
          example: false,
        },
        data: {
          properties: {
            errorType: {
              type: 'string',
              example: options.errorType,
            },
          },
        },
      },
    };
    if (options.message) {
      payload.properties.data.properties['messages'] = {
        type: 'array',
        items: {
          example: options.message,
          type: 'string',
        },
      };
    }
    return payload;
  }
}
