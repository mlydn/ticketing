import { CustomError } from '../errors/custom-error'

export class DatabaseConnectionError extends Error implements CustomError {
  statusCode = 500
  reason = 'Error connecting to database'

  constructor(){
    super()
     // Required when extending a built in class
     Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }

  serialiseErrors() {
    return [
      { message: this.reason }
    ]
  }
}