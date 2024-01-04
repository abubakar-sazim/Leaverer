/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(private readonly orm: MikroORM) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async getAllUsers(): Promise<User[]> {
    const userRepository = this.orm.em.getRepository(User);
    return userRepository.findAll();
  }

  async findOneById(id: number) {
    const userRepository = this.orm.em.getRepository(User);
    return userRepository.findOne({ id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
