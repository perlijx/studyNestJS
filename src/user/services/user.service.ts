import { PaginationParamsDto } from './../../shared/dtos/pagination-params';
/*
 * @Author: perli 1003914407@qq.com
 * @Date: 2023-03-16 10:51:51
 * @LastEditors: perli 1003914407@qq.com
 * @LastEditTime: 2023-03-28 10:36:12
 * @FilePath: /nest/admin-server/src/user/services/user.service.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { SystemService } from '../../shared/system.service';
import { Inject, Injectable } from '@nestjs/common';
import { AppLoggerService } from '../../shared/logger/logger.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { MongoRepository } from 'typeorm';
import { User } from '../entities/user.mongo.entity';
@Injectable()
export class UserService {
  constructor(
    private readonly SystemService: SystemService,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: MongoRepository<User>,
    private readonly logger: AppLoggerService,
  ) {
    this.logger.setContext(UserService.name);
  }
  create(user: CreateUserDto) {
    console.log(this.SystemService.getEnv());
    this.logger.debug(null, '新增用户');
    this.logger.info(null, '新增用户');
    // if (user.password) {
    //   const { salt, hashPassword } = this.getPassword(user.password);
    //   user.salt = salt;
    //   user.password = hashPassword;
    // }
    return this.userRepository.save({
      name: 'haha',
      email: '1@1.com',
    });
  }
  async findAll({
    pageSize,
    page,
  }: PaginationParamsDto): Promise<{ data: User[]; count: number }> {
    //  Promise<{ data: User[]; count: number }> 用于返回类型 data: User[] 用于返回类型 count: number 用于返回类型
    const [data, count] = await this.userRepository.findAndCount({
      //  findAndCount 用于查询数据
      order: { name: 'DESC' }, //  order: { name: 'DESC' } 用于排序
      skip: (page - 1) * pageSize, // skip: (page - 1) * pageSize 用于分页
      take: pageSize * 1, // take: pageSize * 1 用于分页
      cache: true, // cache: true 用于缓存
    });

    // 100 => 第二页 5 6-10
    return {
      data,
      count,
    };
  }
  async findOne(id: string) {
    return this.userRepository.findOneBy(id);
  }

  async update(id: string, user: CreateUserDto) {
    return this.userRepository.update(id, user);
  }

  async remove(id: string): Promise<any> {
    return await this.userRepository.delete(id);
  }
}
