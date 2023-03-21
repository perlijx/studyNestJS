import { generateDocument } from './doc';
/*
 * @Author: perli 1003914407@qq.com
 * @Date: 2023-03-13 15:34:51
 * @LastEditors: perli 1003914407@qq.com
 * @LastEditTime: 2023-03-16 11:01:11
 * @FilePath: /nest/admin-server/src/main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  generateDocument(app);
  await app.listen(3000);
}
bootstrap();
