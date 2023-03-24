/*
 * @Author: perli 1003914407@qq.com
 * @Date: 2023-03-22 15:03:19
 * @LastEditors: perli 1003914407@qq.com
 * @LastEditTime: 2023-03-22 15:10:09
 * @FilePath: /nest/admin-server/src/user/user.providers.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { User } from './entities/user.entity';

export const UserProviders = [
  {
    provide: 'USER_REPOSITORY',
    inject: ['MONGODB_DATA_SOURCE'],
    useFactory: async (AppDataSource) => {
      await AppDataSource.getRepository(User);
    },
  },
];
