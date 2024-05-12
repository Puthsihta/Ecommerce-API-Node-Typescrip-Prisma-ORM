import { ErrorCode, HTTPException } from "./root.excpetion";

export class UnAuthorizedException extends HTTPException {
  constructor(message: boolean, data: string, errorCode: ErrorCode) {
    super(message, data, errorCode, 401, null);
  }
}
