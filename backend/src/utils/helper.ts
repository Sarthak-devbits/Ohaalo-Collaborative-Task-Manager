import { httpStatusCodes } from './httpStatusCode';
import { Response } from 'express';

export class Helpers {
  static sendResponse(
    code: number,
    payload: any,
    res: Response,
    message: string = ''
  ) {
    const responseData = {
      status_code: code,
      flag: httpStatusCodes[code].flag,
      message: message || httpStatusCodes[code].message,
      data: payload,
    };
    return res.status(code).send(Object.assign(responseData));
  }
}
