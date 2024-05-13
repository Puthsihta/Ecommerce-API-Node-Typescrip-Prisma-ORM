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
  USER_ALREADY_EXIST = 400,
  INCORRECT_PASSWORD = 400,
  UNPROCESSABLE = 400,
  INTERNAL_ERROR = 400,
  UNAUTHORIZED = 401,
  NOT_FOUNT = 404,
}
