/*
 * @Author: perli 1003914407@qq.com
 * @Date: 2023-03-16 10:51:51
 * @LastEditors: perli 1003914407@qq.com
 * @LastEditTime: 2023-03-24 15:03:26
 * @FilePath: /nest/admin-server/src/user/user.service.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { SystemService } from './../shared/system.service';
import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MongoRepository } from 'typeorm';
import { User } from './entities/user.mongo.entity';
@Injectable()
export class UserService {
  constructor(
    private readonly SystemService: SystemService,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: MongoRepository<User>,
  ) {}
  create(createUserDto: CreateUserDto) {
    console.log(this.SystemService.getEnv());

    return this.userRepository.save({
      name: '张三',
      email: '11@qq.com',
    });
  }

  findAll() {
    return this.userRepository.findAndCount({});
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
