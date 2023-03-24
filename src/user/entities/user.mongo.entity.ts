/*
 * @Author: perli 1003914407@qq.com
 * @Date: 2023-03-22 15:03:56
 * @LastEditors: perli 1003914407@qq.com
 * @LastEditTime: 2023-03-24 15:09:00
 * @FilePath: /nest/admin-server/src/user/entities/user.mogo.entity.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class User {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column('text')
  name: string;

  @Column({ length: 200 })
  email: string;
}
