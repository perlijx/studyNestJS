/*
 * @Author: perli 1003914407@qq.com
 * @Date: 2023-03-13 15:34:51
 * @LastEditors: perli 1003914407@qq.com
 * @LastEditTime: 2023-03-13 19:10:20
 * @FilePath: /nest/admin-server/src/app.controller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller('')
@ApiTags('用户管理')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: '打招呼',
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
