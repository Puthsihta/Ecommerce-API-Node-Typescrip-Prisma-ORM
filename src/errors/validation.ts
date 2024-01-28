import { HTTPException } from "./root.excpetion";

export class UnprocessableEntity extends HTTPException {
  constructor(error: any, message: string, erroCode: number) {
    super(message, erroCode, 422, error);
  }
}
