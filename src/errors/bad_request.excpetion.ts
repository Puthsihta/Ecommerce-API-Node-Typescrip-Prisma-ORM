import { ErrorCode, HTTPException } from "./root.excpetion";

export class BadRequestException extends HTTPException {
  constructor(message: boolean, data: string, errorCode: ErrorCode) {
    super(message, data, errorCode, 400, null);
  }
}
