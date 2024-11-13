// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { ClientRedis } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users: User[] = [];

  constructor(
    @Inject('NOTIFICATION_SERVICE') private readonly client: ClientRedis,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new UserEntity(createUserDto);
    this.users.push(user);

    // Emit event to notification service
    await this.client.emit('user_created', user);

    return user;
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto): User {
    const user = this.findOne(id);
    Object.assign(user, updateUserDto);
    return user;
  }

  remove(id: string): void {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.users.splice(index, 1);
  }
}
