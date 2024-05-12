import { HTTPException } from "./root.excpetion";

export class UnprocessableEntity extends HTTPException {
  constructor(message: boolean, data: string, erroCode: number, error: any) {
    super(message, data, erroCode, 422, error);
  }
}
