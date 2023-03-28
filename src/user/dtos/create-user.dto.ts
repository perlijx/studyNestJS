/*
 * @Author: perli 1003914407@qq.com
 * @Date: 2023-03-16 10:51:51
 * @LastEditors: perli 1003914407@qq.com
 * @LastEditTime: 2023-03-27 16:34:57
 * @FilePath: /nest/admin-server/src/user/dtos/create-user.dto.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  /*
    手机号(系统唯一)
  */
  @ApiProperty({
    //设置注释
    example: '15619235990', //设置实例
  })
  readonly phoneNumber?: string;
  @ApiProperty({
    //设置注释
    example: '123', //设置实例
  })
  password?: string;
  @ApiProperty({
    //设置注释
    example: '123@qq.com', //设置实例
  })
  email?: string;
}
