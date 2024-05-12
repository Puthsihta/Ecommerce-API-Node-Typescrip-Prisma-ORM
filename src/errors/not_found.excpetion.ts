import { ErrorCode, HTTPException } from "./root.excpetion";

export class NotFoundException extends HTTPException {
  constructor(message: boolean, data: string, errorCode: ErrorCode) {
    super(message, data, errorCode, 404, null);
  }
}
