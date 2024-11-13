import { CustomHttpException } from './http-exception';

export class ValidationException extends CustomHttpException {
  constructor(message: string) {
    super(message, 400);
  }
}
