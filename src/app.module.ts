/*
 * @Author: perli 1003914407@qq.com
 * @Date: 2023-03-15 18:04:17
 * @LastEditors: perli 1003914407@qq.com
 * @LastEditTime: 2023-03-15 18:13:06
 * @FilePath: /nest/admin-server/src/app.module.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [UserModule],
})
export class AppModule {}
