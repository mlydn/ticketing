export interface CustomError {
  statusCode: number
  serialiseErrors(): {
    message: string
    field?: string
  }[]
}