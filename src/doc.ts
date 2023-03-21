/*
 * @Author: perli 1003914407@qq.com
 * @Date: 2023-03-16 10:52:47
 * @LastEditors: perli 1003914407@qq.com
 * @LastEditTime: 2023-03-16 11:00:54
 * @FilePath: /nest/admin-server/src/doc.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import * as packageConfig from '../package.json';

export const generateDocument = (app) => {
  const options = new DocumentBuilder()
    .setTitle(packageConfig.name)
    .setDescription(packageConfig.description)
    .setVersion(packageConfig.version)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api/doc', app, document);
};
