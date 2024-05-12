export class HTTPException {
  message: boolean;
  data: string;
  errorCode: any;
  statusCode: number;
  error: ErrorCode;

  constructor(
    message: boolean,
    data: string,
    errorCode: ErrorCode,
    statusCode: number,
    error: any
  ) {
    this.message = message;
    this.data = data;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.error = error;
  }
}
export enum ErrorCode {
  USER_NOT_FOUND = 1001,
  USER_ALREADY_EXIST = 1002,
  INCORRECT_PASSWORD = 1003,
  UNPROCESSABLE = 2001,
  INTERNAL_ERROR = 3001,
  UNAUTHORIZED = 4001,
  PRODUCT_NOT_FOUNT = 5001,
}
