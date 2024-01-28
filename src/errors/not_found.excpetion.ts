import { ErrorCode, HTTPException } from "./root.excpetion";

export class NotFoundException extends HTTPException {
  constructor(message: string, errorCode: ErrorCode) {
    super(message, errorCode, 404, null);
  }
}
