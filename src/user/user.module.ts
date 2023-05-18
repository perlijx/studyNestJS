import { RoleController } from './controllers/role.controller';
import { RoleService } from './services/role.service';
/*
 * @Author: perli 1003914407@qq.com
 * @Date: 2023-03-16 10:51:51
 * @LastEditors: perli 1003914407@qq.com
 * @LastEditTime: 2023-05-18 10:24:41
 * @FilePath: /nest/src/user/user.module.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { SharedModule } from '../shared/shared.module';
import { UserProviders } from './user.providers';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [UserController, RoleController, AuthController],
  providers: [
    UserService,
    RoleService,
    ...UserProviders,
    AuthService,
    JwtStrategy,
  ],
  imports: [
    SharedModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [SharedModule],
      useFactory: (configService: ConfigService) => configService.get('jwt'),
    }),
  ],
})
export class UserModule {}
