export class DatabaseConnectionError extends Error {
  reason = 'Error connecting to database'

  constructor(){
    super()
     // Required when extending a built in class
     Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }
}