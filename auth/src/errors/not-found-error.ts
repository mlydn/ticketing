import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
  statusCode = 404
  reason = 'Not Found'

  constructor() {
    super('Not Found')

    Object.setPrototypeOf(this, NotFoundError.prototype)
  }

  serialiseErrors() {
    return [
      { message: this.reason }
    ]
  }
}