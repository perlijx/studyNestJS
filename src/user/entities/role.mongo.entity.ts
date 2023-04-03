import { Entity, Column } from 'typeorm';
import { Common } from 'src/shared/entities/common.entity';
@Entity()
export class Role extends Common {
  // 角色名
  @Column('text')
  name: string;

  // 权限
  @Column('')
  permissions: object;
}
