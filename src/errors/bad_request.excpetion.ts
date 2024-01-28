import { ErrorCode, HTTPException } from "./root.excpetion";

export class BadRequestException extends HTTPException {
  constructor(message: string, errorCode: ErrorCode) {
    super(message, errorCode, 400, null);
  }
}
