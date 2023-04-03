import { RoleController } from './controllers/role.controller';
import { RoleService } from './services/role.service';
/*
 * @Author: perli 1003914407@qq.com
 * @Date: 2023-03-16 10:51:51
 * @LastEditors: perli 1003914407@qq.com
 * @LastEditTime: 2023-04-03 16:55:26
 * @FilePath: /nest/src/user/user.module.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { SharedModule } from '../shared/shared.module';
import { UserProviders } from './user.providers';

@Module({
  controllers: [UserController, RoleController],
  providers: [UserService, RoleService, ...UserProviders],
  imports: [SharedModule],
})
export class UserModule {}
