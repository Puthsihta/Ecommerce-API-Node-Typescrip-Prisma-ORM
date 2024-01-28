import { ErrorCode, HTTPException } from "./root.excpetion";

export class UnAuthorizedException extends HTTPException {
  constructor(message: string, errorCode: ErrorCode) {
    super(message, errorCode, 401, null);
  }
}
