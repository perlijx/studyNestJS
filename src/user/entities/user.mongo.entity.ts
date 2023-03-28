/*
 * @Author: perli 1003914407@qq.com
 * @Date: 2023-03-22 15:03:56
 * @LastEditors: perli 1003914407@qq.com
 * @LastEditTime: 2023-03-28 10:42:34
 * @FilePath: /nest/admin-server/src/user/entities/user.mongo.entity.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Common } from '@/shared/entities/common.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends Common {
  @Column('text')
  name: string;

  @Column({ length: 200 })
  email: string;
}
