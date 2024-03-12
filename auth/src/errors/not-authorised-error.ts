import { CustomError } from './custom-error'

export class NotAuthorisedError extends CustomError {
  statusCode = 401
  reason = 'Not Authorised'

  constructor() {
    super('Not Authorised')

    Object.setPrototypeOf(this, NotAuthorisedError.prototype)
  }

  serialiseErrors() {
    return [{ message: this.reason }]
  }
}
