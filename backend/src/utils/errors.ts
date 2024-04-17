export class BaseError extends Error {
  code: number | undefined;

  constructor({
    code,
    message,
    stack,
  }: {
    message: string;
    code?: number;
    stack?: any;
  }) {
    super();
    this.code = code;
    this.stack = stack;
    this.message = message;
  }
}

export class DataBaseError extends BaseError {
  constructor(options: { message: string; code?: number; stack?: any }) {
    super(options);
  }
}

export class RequestError extends BaseError {
  constructor(options: { message: string; code: number; stack?: any }) {
    super(options);
  }
}
