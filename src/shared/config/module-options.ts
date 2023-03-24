/*
 * @Author: perli 1003914407@qq.com
 * @Date: 2023-03-21 14:45:34
 * @LastEditors: perli 1003914407@qq.com
 * @LastEditTime: 2023-03-24 11:03:40
 * @FilePath: /nest/admin-server/src/shared/config/module-options.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';

import configuration from './configuration';

export const configModuleOptions: ConfigModuleOptions = {
  envFilePath: '.env',
  load: [configuration],
};
