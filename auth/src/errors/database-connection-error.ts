import { CustomError } from '../errors/custom-error'

export class DatabaseConnectionError extends CustomError {
  statusCode = 500
  reason = 'Error connecting to database'

  constructor(){
    super('Error connecting to database')
     // Required when extending a built in class
     Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }

  serialiseErrors() {
    return [
      { message: this.reason }
    ]
  }
}