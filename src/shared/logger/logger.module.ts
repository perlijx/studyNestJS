/*
 * @Author: perli 1003914407@qq.com
 * @Date: 2023-03-24 18:10:12
 * @LastEditors: perli 1003914407@qq.com
 * @LastEditTime: 2023-03-28 10:25:48
 * @FilePath: /nest/admin-server/src/shared/logger/logger.module.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Module } from '@nestjs/common';
import { AppLoggerService } from './logger.service';

@Module({
  providers: [AppLoggerService],
  exports: [AppLoggerService],
})
export class AppLoggerModule {}
