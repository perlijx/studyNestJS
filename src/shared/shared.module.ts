/*
 * @Author: perli 1003914407@qq.com
 * @Date: 2023-03-17 15:59:28
 * @LastEditors: perli 1003914407@qq.com
 * @LastEditTime: 2023-03-24 18:16:32
 * @FilePath: /nest/admin-server/src/shared/shared.module.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AEjjjj
 */
import { DatabaseProviders } from './database.providers';
import { configModuleOptions } from './configs/module-options';
import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { ConfigModule } from '@nestjs/config';
import { AppLoggerModule } from './logger/logger.module';
@Module({
  imports: [ConfigModule.forRoot(configModuleOptions), AppLoggerModule],
  providers: [SystemService, ...DatabaseProviders],
  exports: [SystemService, ConfigModule, ...DatabaseProviders, AppLoggerModule],
})
export class SharedModule {}
