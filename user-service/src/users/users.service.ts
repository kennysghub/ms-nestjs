import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { ClientRedis } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import {
  UserNotFoundException,
  DuplicateEmailException,
} from '../common/exceptions/user.exception';

import { Logger } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private users: User[] = [];

  constructor(
    @Inject('NOTIFICATION_SERVICE') private readonly client: ClientRedis,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Check for existing user with same email
      const existingUser = this.users.find(
        (user) => user.email === createUserDto.email,
      );
      if (existingUser) {
        throw new DuplicateEmailException(createUserDto.email);
      }

      const user = new UserEntity(createUserDto);
      this.users.push(user);

      // Emit event to notification service
      await this.client.emit('user_created', user);
      this.logger.log(`User created successfully: ${user.id}`);

      return user;
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`);
      throw error;
    }
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new UserNotFoundException(id);
    }
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto): User {
    try {
      const user = this.findOne(id);

      // If email is being updated, check for duplicates
      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingUser = this.users.find(
          (u) => u.email === updateUserDto.email,
        );
        if (existingUser) {
          throw new DuplicateEmailException(updateUserDto.email);
        }
      }

      Object.assign(user, updateUserDto);
      this.logger.log(`User updated successfully: ${id}`);
      return user;
    } catch (error) {
      this.logger.error(`Failed to update user ${id}: ${error.message}`);
      throw error;
    }
  }

  remove(id: string): void {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new UserNotFoundException(id);
    }
    this.users.splice(index, 1);
    this.logger.log(`User deleted successfully: ${id}`);
  }
}
