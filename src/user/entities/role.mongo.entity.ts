import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  Unique,
  UpdateDateColumn,
  ObjectIdColumn,
  CreateDateColumn,
  ManyToMany,
  ObjectID,
  JoinTable,
} from 'typeorm';
import { User } from './user.mongo.entity';
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
