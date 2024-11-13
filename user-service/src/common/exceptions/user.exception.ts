import { CustomHttpException } from './http-exception';

export class UserNotFoundException extends CustomHttpException {
  constructor(userId: string) {
    super(`User with ID ${userId} not found`, 404);
  }
}

export class DuplicateEmailException extends CustomHttpException {
  constructor(email: string) {
    super(`User with email ${email} already exists`, 409);
  }
}
