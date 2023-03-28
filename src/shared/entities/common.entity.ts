import {
  Column,
  CreateDateColumn,
  ObjectID,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class Common {
  @ObjectIdColumn()
  _id: ObjectID;
  @CreateDateColumn()
  createAt: Date;
  @UpdateDateColumn()
  updateAt: Date;
  @Column({
    default: false,
    select: false,
  })
  isDelete: boolean;
  @Column({
    select: false,
  })
  version: number;
}
