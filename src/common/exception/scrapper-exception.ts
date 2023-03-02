import { HttpException } from '@nestjs/common';

export interface IError {
  code: number;
  message: string;
  log: boolean;
}

export const errors: { [key: string]: IError } = {
  UrlNotCorrect: { code: 400, message: 'url_not_correct', log: false },
  WebsiteAlreadyExist: { code: 400, message: 'website_already_exist', log: false },

};

export class ScrapperException extends HttpException {
  private readonly log: boolean;
  protected constructor(error: keyof typeof errors) {
    super(`${errors[error].message}`, errors[error].code);
    this.log = errors[error].log;
  }

  loggable() {
    return this.log;
  }
}

export class UrlNotCorrectException extends ScrapperException {
  constructor() {
    super('UrlNotCorrect');
  }
}

export class WebsiteAlreadyExist extends ScrapperException {
  constructor() {
    super('WebsiteAlreadyExist');
  }
}
