/*
 * @Author: perli 1003914407@qq.com
 * @Date: 2023-03-17 15:59:28
 * @LastEditors: perli 1003914407@qq.com
 * @LastEditTime: 2023-04-20 14:52:47
 * @FilePath: /nest/src/shared/shared.module.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AEjjjj
 */
import { DatabaseProviders } from './database.providers';
import { configModuleOptions } from './configs/module-options';
import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { ConfigModule } from '@nestjs/config';
import { AppLoggerModule } from './logger/logger.module';
import { UploadService } from './upload/upload.service';
@Module({
  imports: [ConfigModule.forRoot(configModuleOptions), AppLoggerModule],
  providers: [SystemService, ...DatabaseProviders, UploadService],
  exports: [
    SystemService,
    ConfigModule,
    ...DatabaseProviders,
    AppLoggerModule,
    UploadService,
  ],
})
export class SharedModule {}
