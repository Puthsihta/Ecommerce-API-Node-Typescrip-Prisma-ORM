import { HTTPException } from "./root.excpetion";

export class InternalException extends HTTPException {
  constructor(message: boolean, data: string, errors: any, errorCode: number) {
    super(message, data, errorCode, 500, errors);
  }
}
