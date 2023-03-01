import { HttpStatus } from '@nestjs/common';

export class RawResponse<T> {
  constructor(private readonly data: T, private readonly status?: HttpStatus) {}

  getResponse(): T {
    return this.data;
  }

  getStatus(): HttpStatus {
    return this.status;
  }
}
