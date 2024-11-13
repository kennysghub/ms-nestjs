import { User } from '../interfaces/user.interface';

export class UserEntity implements User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
    this.id = Math.random().toString(36).substr(2, 9);
    this.createdAt = new Date();
  }
}
