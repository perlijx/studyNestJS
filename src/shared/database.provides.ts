/*
 * @Author: perli 1003914407@qq.com
 * @Date: 2023-03-22 14:51:43
 * @LastEditors: perli 1003914407@qq.com
 * @LastEditTime: 2023-03-24 11:22:27
 * @FilePath: /nest/admin-server/src/shared/database.provides.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

// 设置数据库类型
const databaseType: DataSourceOptions['type'] = 'mongodb';
// 数据库注入
export const DatabaseProviders = [
  {
    provide: 'MONGODB_DATA_SOURCE',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const config = {
        type: databaseType,
        url: configService.get<string>('database.url'),
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.pass'),
        database: configService.get<string>('database.name'),
        entities: [path.join(__dirname, `../../**/*.mongo.entity{.ts,.js}`)],
        logging: configService.get<boolean>('database.logging'),
        synchronize: configService.get<boolean>('database.synchronize'),
      };

      const ds = new DataSource(config);
      await ds.initialize();
      return ds;
    },
  },
];
