import { ValidationError } from "express-validator"
import { CustomError } from "../errors/custom-error"

export class RequestValidationError extends Error implements CustomError {
  statusCode = 400

  constructor(public errors: ValidationError[]) {
    super()

    // Required when extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype)
  }

  serialiseErrors() {
    return this.errors.map(err => {
      if (err.type === 'field') {
        return { message: err.msg, field: err.path }
      }
      return { message: err.msg }
    })
  }
}