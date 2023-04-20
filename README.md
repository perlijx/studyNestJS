<!--
 * @Author: perli 1003914407@qq.com
 * @Date: 2023-03-13 15:34:51
 * @LastEditors: perli 1003914407@qq.com
 * @LastEditTime: 2023-04-20 15:03:56
 * @FilePath: /nest/README.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

### 创建项目

- `nest new xxx` 命令创建项目
- `nest go mo xxxx` 创建 Module
- `nest go s xxxx` 创建 service
- `nest go co xxxx` 创 controller
- `nest go co xxxx` 创建-套 Restful 风格接口

### 创建 Swagger 文档

1. 安装插件 `pnpm i @nestjs/swagger`

2. 在`src`文件夹下创建`doc.ts` 文件

```ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import * as packageConfig from '../package.json'; //从package.json文件中导出项目的信息

export const generateDocument = (app) => {
  const options = new DocumentBuilder()
    .setTitle(packageConfig.name) //设置标题
    .setDescription(packageConfig.description) //设置描述
    .setVersion(packageConfig.version) //设置版本
    .addBearerAuth() //增加鉴权功能
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setUp('/api/doc', app, document);
};
```

3. 在 Ts 中要导入 json 需要在 TS.config.json 中配置

```json
{
  "compilerOptions": {
    "resolveJsonModule": true
  }
}
```

4.  在项目的 main.js 中配置 swagger

```ts
import { generateDocument } from './doc';
async function bootstrap() {
  //创建文档
  generateDocument(app);
  await app.listen(3000, '0.0.0.0');
}
```

5. 在项目中就可以使用装饰器来给接口添加文档了

```ts


import {ApiOperation, ApiTags, ApiResponse, ApiBearerAuth} from "@nestjs/swagger"

@ApiTags("用户")
class user() {
  @ApiOperation({
    summary: "新增用户"
  })
  create() {

  }
}
```

### Controller 与 Http 接口实现 实现

Controller 负责处理输入的 request 请求并向客户端进行相应

![mvc模型](https://secure2.wostatic.cn/static/8YzGDxVZUX9Cp1NJdeS1Ea/image.png?auth_key=1678936546-n1S5Gzk78F6PdpwTaeU9v7-0-ac537243e83e7d7153d73107813a1d95&image_process=resize,w_441&file_size=167877)

dto

数据传输对象
DTO 是一组需要跨进程或网络边界传输的聚合数据的简单容器。它不应该包含业务逻辑，并将其行为限制为诸如内部一致性检查和基本验证之类的活动

##### 在 nest 中写一个 dto

1. 写一个 dto 文件

```ts
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  /*
   手机号(系统唯一)
 */
  @ApiProperty({
    //设置注释
    example: '15619235990', //设置实例
  })
  readonly phoneNumber: string;
  @ApiProperty({
    //设置注释
    example: '123', //设置实例
  })
  password: string;
  @ApiProperty({
    //设置注释
    example: '123@qq.com', //设置实例
  })
  email: string;
}
```

2.  在 controller 中引入

```ts
import { CreateUserDto } from './dto/create-user.dto';
  create(@Body() createUserDto: CreateUserDto) {
   return this.userService.create(createUserDto);
 }
```

### IOC 控制反转

控制反转指的是本来应该在类内部加载的属性现在交给外部的控制器把所需依赖注入

列子

```js
//修改前
class Wheel {
  constructor(brand) {
    this.brand = brand
  }
}

class Car {
  constructor() {
    this.wheel = mew Wheel("米其林")
  }
  run() {
    console.log(`汽车是用${this.wheel.brand}牌子的轮子跑`)
  }
}
new Car().run()
//  打印  汽车是用[米其林]`牌子的轮子跑

/*
  这样的代码耦合性太高 要是要改变汽车的轮子需要 修改代码 如果汽车还需要其他的组件就要在改动Car这个类
  我们可以使用控制反转的思想把汽车所需的组件交给一个容器来生成保存,最后注入到汽车类中这样解耦了汽车与轮子,也让汽车
  更容器获取其他组件
*/
//改进后

class Wheel {
  constructor(brand){
    this.brand = brand
  }
}

class Container {
  constructor() {
    this.modules = {}
  }
  provide(key, object) {
    this.modules[key] = object
  }
  get(key) {
    return this.modules[key]
  }
}

class Car {
  constructor(container) {
    this.wheel = container.get("wheel")
  }
  run() {
     console.log(`汽车是用${this.wheel.brand}牌子的轮子跑`)
  }
}
const container = new Container()
container.provide("wheel", new Wheel("米其林"))
new Car(container).run()
```

在 nestjs 中也是使用了控制反转的思想项目的 service 层就是使用依赖注入的设计模式完成的

1. 创建一个 user.service.ts 文件

```ts
import { Injectable } from '@nestjs/common';
class UserService {
  @Injectable() //添加注解 表示这个方法可以被注入
  create() {}
}
```

2. 在 module.ts 中把 user.service.ts 中的 service 提供给 整个 user 的所有类中

```ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [UserService], //把 UserService 提供给 user 的所有类中
})
export class UserModule {}
```

3. 在 userController 中就可以直接使用这些被注入的 模块了

```ts
@Controller('user')
@ApiTags('用户中心')
export class UserController {
  constructor(private readonly userService: UserService /*已经注入了*/) {}
  @Post()
  @ApiOperation({
    summary: '新增用户',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto); //可以直接使用 userService中的 create方法
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
```

### 用 Module 实现模块化

之前我们使用 providers 和 injectable 实现了模块内部的交互
现在我们在学习使用 Module 模块来实现模块之间的交互

1. 创建 shared 文件夹和 system.service.ts 文件

```ts
@Injectable()
export class SystemService {
  constructor() {}

  getEnv() {
    return {
      a: 1,
    };
  }
}
```

2. 在 shared 文件夹中 创建 shared.module.ts 文件

```ts
import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
@Module({
  provides: [SystemService],
  exports: [SystemService], //导出整个SystemService 模块
})
export class SharedModule {}
```

3. 在要使用该模块的模块的 Module 的文件中引入整个 shared 模块 就可以在该模块中使用的

```ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SharedModule } from '../shared/shared';
@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [SharedModule], //引入整个SharedModule 模块
})
export class UserModule {}
```

4. 在 user.service.ts 文件中使用

```ts
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto, private readOnly systemService: systemService) {
    console.log(this.systemService.gerEnv())
    return 'This action adds a new user';
  }

}

```

### 在 nest 项目中抛出错误

```ts
throw now HttpException("自定义异常", HttpStatus.CONFLICT)
```

### 配置环境变量

1. 安装 @nest/config

```
pnpm i @nest/config
```

2. 创建环境变量 .env 文件

```ts
APP_ENV = development
APP_PORT = 3000
DB_URL = mongodb://mongo:27017
DB_NAME = nest-server
DB_USER = xxxx
DB_ENTITY_NAME = mongo
DB_SYNCHRONIZE = false
DB_LOGGING = true
```

3. 创建环境变量的模版文件 /src/shared/config/configuration.ts

```ts
export default (): any => ({
  env: process.env.APP_ENV,
  port: process.env.APP_PORT,
  database: {
    url: process.env.DB_URL,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    synchronize: process.env.DB_SYNCHRONIZE,
    logging: process.env.DB_LOGGING,
  },
});
```

4. 创建生成环境变量配置模块的工厂文件 /src/config/module-options.ts

```ts
import {ConfigModuleOptions} from "@nestjs/config/dist/interfaces"
import configuration from "./configuration"

export const configModuleOptions: ConfigModuleOptions = {
  envFilePath : ".env"
  load: [configuration]
}
```

5. 注入 Config 模块 在 /src/shared.module.ts

```ts
import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configModuleOptions } from './configs/module-options';

@Module({
  // 注入Config
  imports: [ConfigModule.forRoot(configModuleOptions)],

  // 暴露Config
  exports: [ConfigModule],
})
export class ShareModule {}
```

6. 使用 ConfigService

```ts
export default (): any => ({
  env: process.env.APP_ENV,
  port: process.env.APP_PORT,
  database: {
    url: process.env.DB_URL,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    synchronize: process.env.DB_SYNCHRONIZE,
    logging: process.env.DB_LOGGING

```

### TypeORM 数据持久化

typeORM 是 一个 ORM 框架[ORM 定义](https://segmentfault.com/a/1190000011642533) ORM 最常见使用便是对象与数据库之间的转换

在 nest 中使用

1. 安装 typeORM

```
pnpm i typeorm
pnpm i mongodb@^3.6.0
```

2. 创建数据源

> 在/src/shared 中创建 database.providers.ts 文件

```ts
import {ConfigService} from "nestjs/config"
import {DataSource, DataSourceOptions} from "typeorm"
import * as path from "path"
const databaseType: DataSourceOptions["type"] = "mongodb" //配置typeORM实例的类型为mongodb
// 因为可以配置多个数据源所以DatabaseProvides用数组
export const DatabaseProvides = [
  //配置mongoDB
  {
    provide: "MONGODB_DATA_SOURCE"  //提供的mongodb的数据源
    inject :[ConfigService],//mongodb 要配置的 url地址 , 用户名 ,密码 之类的配置
    useFactory: async (configService: ConfigService) => {
      const config = {
        type: databaseType, //类型为mongodb
        url: configService.get<string>('database.url'), //动态配置为config里的配置
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.pass'),
        database: configService.get<string>('database.name'),
        entities: [path.join(__dirname, `../../**/*.mongo.entity{.ts,.js}`)], // 取src 下的 所有entities文件夹中所有的**.mongo.entity.ts的文件
        logging: configService.get<boolean>('database.logging'),
        synchronize: configService.get<boolean>('database.synchronize'),
      }
      const ds = new DataSource(config)
      await ds.initialize()
      return ds
    }   //生成数据源的工厂函数
  }
]
```

3. 在 shared.module.ts 中注册

```ts
import { DatabaseProviders } from "./database.provides"

@Module({
  exports: [...DatabaseProviders]
  provides: [...DatabaseProviders]
})
```

4. 在要使用 mongodb 的模块中创建数据仓库来声明使用了那几个表(创建 dao 层)

> 在/src/user 创建 user.providers.ts 文件 给数据表提供资源

```ts
//说明可以声明使用很多张表
import { User } from "./entities/user.mongo.entity" //初始化实体为User
export const UserProviders = [
  {
    provide: "USER_REPOSITORY", //提供的的是USER_REPOSITORY这个表
    //AppDataSource 就是之前在database.providers.ts 创建的MONGODB_DATA_SOURCE
    useFactory: async (AppDataSource) => await AppDataSource.getRepository(User)//初始化实体为User
    inject: ["MONGODB_DATA_SOURCE"] //注入MONGODB_DATA_SOURCE
  }
]
```

5. 在 user 的 module.ts 文件中注入刚创建好的 UserProviders

```ts
import {UserProviders} from "./user.providers"

@Module({
  provide:[...UserProviders]
})
```

6. 在 user/entities 文件中创建 user 的 mongo 实体

```ts
import { Column, Entity, ObjectIdColumn, ObjectID } from 'typeorm';
@Entity() //声明实体
export class User {
  @ObjectIdColumn() //必须要一个主键
  _id: ObjectID;
  @Column('text')
  name: string;
  @Column({ length: 200 })
  email: string;
}
```

7. 在 userService 中使用

```ts
import { MongoRepository } from "typeorm"
import { User } from "./entities/user.mongo.entity"
InjectTable()
export class UserService {
              @Inject("USER_REPOSITORY")
  constructor(private readonly userRepository: MongoRepository<User>){} //注入了UserProviders 但是UserProviders是数组无法确定引入的是哪个REPOSITORY所以使用 @Inject 描述下使用那个REPOSITORY

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save({ //调用方法
      name:"张三",
      email:"11@qq.com"
    })
  }
  findAll() {
    this.userRepository.findAndCount({})
  }


}
```

8.  安装 mongodb 注意安装版本为 mongodb@^3.6.0

### 使用 Winston 实现分级日志记录

##### 日志库的必要性

- 传输通道
  - Console 文件
  - File 文件
  - Http 通过 http 传输
  - Stream 流传输
- 格式化
  - 时间戳
  - 格式美化
- 日志分割
  - 按文件大小分割
  - 按写入时间分割
- 日志分级
  - `DEBUG`：调试，等级最低，一般生产环境会将该等级的日志关闭
  - `INFO`：信息，普通等级，最常用的系统日志收集等级，一般会将系统运行中的一些相关信息（非开发类敏感信息）设为该等级
  - `WARN`：*FBI WARNNING*大家都知道，就是警告，但又不到错误
  - `ERROR`：报错，一般程序报错使用该等级
  - `FATAL`：严重，比程序报错还严重的等级，如果没做错误等级划分的话，一般`FATAL`都不怎么用到，都用`ERROR`替代了

在 nest 中使用 Winston

1. 安装 winston

```
pnpm i winston
```

2. 在/src/shared 中创建 logger 子模块文件夹创建 logger.service.ts 文件

```ts
import { Logger, LoggerOptions, transports } from 'winston';

export class AppLogger {
  private logger: Logger;
  private context?: string;

  public setContext(context: string): void {
    //设置上下文
    this.context = context;
  }
  constructor() {
    this.logger = createLogger({
      //生成一个logger的工
      level: process.env.LOGGER_LEVEL || 'info', //日志等级
      format: format.combine(
        //格式化
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), //时间戳
        format.prettyPrint(), //格式美化
      ),
      transports: [
        new transports.File({ filename: 'logs/error.log', level: 'error' }), //
        new transports.File({ filename: 'logs/combined.log' }), //传输通道
        new transports.Console(), //控制台
      ],
    });
  }
  //日志等级
  error(ctx: any, message: string, meta?: Record<string, any>): Logger {
    //错误
    return this.logger.error({
      message, //日志信息
      contextName: this.context, //上下文
      ctx, //上下文
      ...meta, //
    });
  }
  warn(ctx: any, message: string, meta?: Record<string, any>): Logger {
    //警告
    return this.logger.warn({
      message,
      contextName: this.context,
      ctx,
      ...meta,
    });
  }
  info(ctx: any, message: string, meta?: Record<string, any>): Logger {
    //信息
    return this.logger.info({
      message,
      contextName: this.context,
      ctx,
      ...meta,
    });
  }
  debug(ctx: any, message: string, meta?: Record<string, any>): Logger {
    //调试
    return this.logger.debug({
      message,
      contextName: this.context,
      ctx,
      ...meta,
    });
  }
}
```

3. 创建 logger.module.ts 文件

```ts
import { Module } from '@nestjs/common';
import { AppLogger } from './logger.service';

@Module({
  providers: [AppLogger],
  exports: [AppLogger],
})
export class AppLoggerModule {}
```

4. 在 shared.module.ts 中注册

```ts
import { AppLoggerModule } from "./logger/logger.module"

@Module({
  imports: [AppLoggerModule],
  exports: [AppLoggerModule],
})
```

5. 在需要使用的地方注入

```ts
import { AppLogger } from '../shared/logger/logger.service';

@Injectable()
export class UserService {
  constructor(private readonly logger: AppLogger) {
    this.logger.setContext(UserService.name); //设置上下文
  }
  create(createUserDto: CreateUserDto) {
    this.logger.info(null, '创建用户', { a: 123 }); //调用方法
    this.logger.debug(null, '创建用户', { a: 123 }); //调用方法
    return this.userRepository.save({
      //调用方法
      name: '张三',
      email: '',
    });
  }
  findAll() {
    this.logger.info('查询用户');
    this.userRepository.findAndCount({});
  }
}
```

### 实现分页功能

1. 安装依赖

```
pnpm i class-transformer class-validator
```

//class-transformer 用于将对象转换为 json 对象
//class-validator 用于验证对象

2. 分页是一个通用的功能，所以我们在 shared 文件夹下创建一个 dto 文件夹，创建一个分页的 dto 文件

```ts
import { IsNumber, IsOptional, Min, Transform } from 'class-validator'; //验证什么类型的数据 IsOptional 可选的 IsNumber 数字类型

export class PaginationParamsDto {
  @ApiPropertyOptional({
    //swagger文档 可选的   @ApiProperty 为必选
    description: '页码',
    type: Number, //类型
    example: 1, //示例
  })
  @IsNumber() //验证是否为数字
  @IsOptional() //可选的
  @Min(0) //最小值
  @Transform(({ value }) => parseInt(value, 10)) //转换为数字 Transform 转换器 value => Number(value) 为转换 器 value 为传入的值 Number(value) 为转换后的值  也可以自定义转换器 例如 value => value + 1 为传入的值加1
  pageSize = 5;
  @ApiPropertyOptional({
    //swagger文档 可选的   @ApiProperty 为必选
    description: '页码',
    type: Number, //类型
    example: 1, //示例
  })
  @IsNumber() //验证是否为数字
  @IsOptional() //可选的
  @Min(0) //最小值
  @Transform(({ value }) => parseInt(value, 10))
  page = 1;
}
```

3. 在需要使用的地方引入

```ts
import { PaginationParamsDto } from "../shared/dto/pagination.dto"

@Get()
async findAll(@Query() paginationParamsDto: PaginationParamsDto) { //使用 @Query() 获取请求参数
    const {data, count} = await this.userService.findAll()
    return {
      data,
      meta: {
        total:{total:count}
      }
    }

}
```

3. 修改 user.service.ts

```ts
import { PaginationParamsDto } from '../shared/dto/pagination.dto';
class UserService {
  async findAll({
    pageSize,
    page,
  }: PaginationParamsDto): Promise<{ data: User[]; count: number }> {
    //使用解构赋值获取参数
    const [data, count] = await this.userRepository.findAndCount({
      order: { name: 'DESC' }, //排序 降序
      take: pageSize * 1, //获取多少条
      skip: (page - 1) * pageSize, //跳过多少条计算逻辑为 页码-1 * 每页条数 意思是跳过之前的页码的数据
    });
    return { data, count };
  }
}
```

### 实现通用数据项-逻辑删除,时间戳

> 在面向对象的编程中公共的属性和方法可以抽象出来，放到父类中，子类继承父类，就可以使用父类的属性和方法，这样就可以减少代码的重复，提高代码的复用性。在面向对象的编程中，我们可以使用抽象类来实现这个功能。

1. 在 shared 文件夹下创建一个 entities 文件夹,创建一个 common.entity.ts 文件

```ts
import {
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  ObjectId,
  Column,
  VersionColumn,
} from 'typeorm';

export abstract class Common {
  @ObjectIdColumn() //主键
  _id: ObjectId;
  @CreateDateColumn() //创建时间
  createAt: Date; //创建时间
  @UpdateDateColumn() //更新时间
  updateAt: Date; //更新时间
  @Column({
    default: false, //默认值
    select: false, //查询时不显示
  })
  isDelete: boolean; //是否删除
  @VersionColumn({
    select: false, //查询时不显示
  }) //版本号
  version: number; //版本号
}
```

2. 在 user.entity.ts 中继承

```ts
import { Common } from '../shared/entities/common.entity';
export class User extends Common {
  @Column()
  name: string;
  @Column()
  email: string;
  @Column()
  password: string;
}
```

### 利用 RBAC 模型实现权限管理

> RBAC 模型是一种基于角色的访问控制模型，它将权限分配给角色，然后将角色分配给用户。用户通过角色来获得权限，而不是直接获得权限。这样可以减少用户权限的管理，提高权限的复用性。

1. 先创建 role 的 entity 实体文件

```ts
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity()
export class Role extends Common {
  @Column('text')
  name: string;
  @Column('')
  permissions: object;
}
```

2. 补充 user.entity.ts 实体中的字段

```ts
import {
  Entity,
  Column,
  Unique,
  UpdateDateColumn,
  ObjectIdColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  OneToOne,
} from 'typeorm';
import { ObjectId } from 'mongoose'; //引入mongoose的ObjectId类型
import { Common } from '../../shared/entities/common.entity';

@Entity()
export class User extends Common {
  // 昵称
  @Column('text')
  name: string;

  @Column('text')
  avatar: string;

  // @Unique('email', ['email'])
  @Column({ length: 200 })
  email: string;

  // 手机号
  @Column('text')
  phoneNumber: string;

  @Column()
  password: string;

  @Column()
  role?: ObjectId; // 角色 id 为什么不用string类型 因为在mongodb中的id是ObjectId类型所以这里也用ObjectId类型 也可以用string类型但是需要在创建的时候转换为ObjectId类型

  @Column()
  job: string;

  @Column()
  jobName: string;

  @Column()
  organization: string;

  @Column()
  organizationName: string;

  @Column()
  location: string;

  @Column()
  locationName: string;

  @Column()
  introduction: string;

  @Column()
  personalWebsite: string;

  @Column('boolean')
  verified: boolean;

  // 加密盐
  @Column({
    type: 'text',
    select: false,
  })
  salt: string;

  @Column()
  isAccountDisabled?: boolean;
}
```

3. 创建 role.service.ts

```ts
import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { SystemService } from '../../shared/system.service';
import { MongoRepository } from 'typeorm';
import { User } from '../entities/user.mongo.entity';
import { AppLogger } from 'src/shared/logger/logger.service';
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly systemService: SystemService,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: MongoRepository<User>,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(UserService.name);
  }

  create(createUserDto: CreateUserDto) {
    // 调用Modle
    // return 'This action adds a 🚀 new user';
    return this.userRepository.save(createUserDto);
  }

  async findAll({
    pageSize,
    page,
  }: PaginationParamsDto): Promise<{ data: User[]; count: number }> {
    const [data, count] = await this.userRepository.findAndCount({
      order: { name: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize * 1,
      cache: true,
    });

    // 100 => 第二页 5 6-10
    return {
      data,
      count,
    };
  }

  async findOne(id: string) {
    return await this.userRepository.findOneBy(id);
  }

  async update(id: string, user: CreateUserDto) {
    return await this.userRepository.update(id, user);
  }

  async remove(id: string): Promise<any> {
    return await this.userRepository.delete(id);
  }
}
```

4. 在 user.providers.ts 中添加

```ts
import { Role } from './entities/role.mongo.entity';

export const UserProvider = [
  {
    provide: 'ROLE_REPOSITORY',
    useFactory: async (connection: Connection) =>
      await connection.getRepository(Role),
    inject: ['MONGODB_DATA_SOURCE'],
  },
];
```

5. 创建 公共的 Response.dto 文件
   - 在 shared/dots 创建 base-api-response.dto.ts

```ts
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
//ApiProperty 用于描述属性
//ApiPropertyOptional 用于描述可选属性

export class BaseApiResponse<T> {
  public data:T  //返回的数据
  @ApiProperty({type:Object})
  public meta: any // 元数据
}

export function SwaggerBaseApiResponse<T>(type:T): typeof  BaseApiResponse {
  class ExtendedBaseApiResponse<T> extends BaseApiResponse<T> {
    @ApiProperty({type}) // 用于描述属性
    public data: T

    const isAnArray = Array.isArray(type) ?  " [ ] " : " "
    Object.defineProperty(ExtendedBaseApiResponse,"name",{
      value:`SwaggerBaseApiResponseFor ${type} ${isAnArray}`
    })
  }
  return ExtendedBaseApiResponse
}


export class BaseApiErrorObject {

  @ApiProperty({type:Number})
  public statusCode: number

  @ApiProperty({type:String})
  public message: string

  @ApiPropertyOptional({type:String})
  public LocalizedMessage: string

  @ApiProperty({type:String})
  public errorName: string

  @ApiProperty({type:Object})
  public details: unknown

  @ApiProperty({ type: String })
  public path: string;

  @ApiProperty({ type: String })
  public requestId: string;

  @ApiProperty({ type: String })
  public timestamp: string;

}

export class BaseApiErrorResponse {
  @ApiProperty(type:BseApiErrorObject)
  public error: BaseApiErrorObject
}
```

6. 创建 role.controller.ts

```ts
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';

import { RoleService } from '../service/role.service';

import { CreateRoleDto } from '../dtos/create-role.dto';
@ApiTags('角色')
@Controller('role')
export class RoleController {
  constructor(private readOnly roleService: RoleService ) {

  }
  @ApiOperation({summary:'创建角色'})
  @ApiResponse({
    status: HttpStatus.CREATED,
    type:SwaggerBaseApiResponse(CreateRoleDto)
  })
  @ApiResponse({
    status:HttpStatus.NOT_FOUND,
    type:BaseApiErrorResponse
  })
  @post("")

  create(@Body() Role:CreateRoleDto) {
    return this.roleService.create(Role)
  }
  @ApiOperation({
  summary: '查找所有角色',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([CreateRoleDto]),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @Get()
  async findAll(
    @Query() query: PaginationParamsDto
  ) {
    // console.log(query)
    const { data, count } = await this.RoleService.findAll(query);
    return {
      data,
      meta: { total: count }
    }
  }
  @ApiOperation({
    summary: '查找单个角色',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(CreateRoleDto),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      data: await this.RoleService.findOne(id)
    }
  }

  @ApiOperation({
    summary: '更新单个角色',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(CreateRoleDto),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCourseDto: CreateRoleDto) {
    return {
      data: await this.RoleService.update(id, updateCourseDto)
    }
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: '删除单个角色',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.RoleService.remove(id);
  }

}

```

### 使用 hash 加密密码

> hash 的雪崩效应是指，当一个 hash 函数的输入发生变化时，它的输出也会发生变化

1. 安装 crypto

```
pnpm i crypto
```

2. 在 shared/utils 中创建 hash.util.ts

```ts
import * as crypto from 'crypto';
// 产生随机的盐
export function makeSalt(len = 3): string {
  //crypto.randomBytes 产生随机的2进制
  //使用toString('base64') 转换成base64 产生随机的盐å
  return crypto.randomBytes(len).toString('base64');
}

export function encryptPassword(password: string, salt: string): string {
  if (!password || !salt) {
    return '';
  }
  //把盐转换成2进制
  const tempSalt = Buffer.from(salt, 'base64');

  //使用pbkdf2Sync 进行加密
  //第一个参数是密码
  //第二个参数是盐
  //第三个参数是迭代次数
  //第四个参数是输出的长度
  //第五个参数是加密的算法
  //最后使用toString('base64') 转换成base64
  //sha1是一种加密算法 也可以使用sha256 sha512 等
  return crypto
    .pbkdf2Sync(password, tempSalt, 10000, 64, 'sha1')
    .toString('base64');
}
```

3. 在 user.entity.ts 中使用

```ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { makeSalt, encryptPassword } from 'src/shared/utils/cryptogram.util';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  avatar: string;

  @Column()
  status: number;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @Column()
  deleted_at: Date;

  @BeforeInsert()
  async beforeInsert() {
    this.salt = makeSalt();
    this.password = encryptPassword(this.password, this.salt);
  }
}
```

4. 在 user.service.ts 中使用

```ts
import { makeSalt, encryptPassword } from 'src/shared/utils/cryptogram.util';

//在 user.service.ts 创建加密密码的方法

getPassword(password: string) : object {
  const salt = makeSalt()
  const hashPassword = encryptPassword(password, salt)
  return {
    salt,
    hashPassword
  }
}

//在 user.service.ts 中的create和 update 方法中使用 使用

create(user:CreateUserDto) {
  if(user.password) {
    const {salt, hashPassWord} = this.getPassword(user.password)
    user = {
      ...user,
      salt,
      password: hashPassWord
    }
  }
  return this.userRepository.save(user)
}

```

### 利用 interceptor 拦截器实现 HTTP 流解析

> 拦截器是一种可以在请求或响应被路由之前或之后拦截的机制。它可以用来实现身份验证、日志记录、错误处理等功能。 拦截器可以被应用到控制器、方法或者全局。

nest 的底层可以用例如 express、fastify、hapi 等框架,但是这些框架的请求和响应都是流的形式,所以我们需要用拦截器来解析流,本项目使用的底层框架是 express,所以我们需要安装 @nestjs/platform-express,@nestjs/platform-expresse 是 express 的一个包,用来解析流。

1. 安装 @nestjs/platform-express

```
pnpm i @nestjs/platform-express
```

2. 在 user.controller.ts 中创建上传文件的接口

```ts
/*
  @UseInterceptors是用来使用拦截器的装饰器
  @FileInterceptor 是用来解析流的拦截器
  @ApiConsumes 是用来描述请求体的格式
  multipart/form-data 是swagger描述请求体的格式例如: application/json
  'file' 是接收的文件的key值还有其他的值例如: 'files' 'file'
  @Req 用来获取请求
  Request用来获取流
  @Body 用来获取请求体
  UploadDto用来接收请求体
  @UploadedFile 用来获取文件
*/
@Post('upload')
@ApiConsumes('multipart/form-data')
@UseInterceptors(FileInterceptor('file'))
async upload(@Req() req: Request, @Body() uploadDto: UploadDT @UploadedFile() file) {
  console.log(req.body)
}
```

2. 创建 UploadDto 文件

```ts
export class UploadDTO {
  @ApiProperty({
    description: '文件', // 描述
    type: 'string', //数据类型
    format: 'binary', //数据格式 format的格式有很多种,例如: 'binary', 'byte', 'date', 'date-time', 'password', 'email', 'uuid', 'uri', ' 'binary' 是二进制数据
    example: 'xx文件',
  })
  name: string;
  @ApiProperty({
    description: '文件', // 描述
    type: 'string', //数据类型
    format: 'binary',
    required: true, //是否必须
  })
  // Express.Multer.File 是express的一个类型,用来接收流在安装TS的类型文件时需要安装@types/express和 @types/multer
  file: Express.Multer.File;
}
```

3. 修改 main.ts 文件

```ts
import { generateDocument } from './doc';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); // 创建一个express的实例
  // app.useGlobalPipes是全局使用验证管道
  // ValidationPipe是验证管道的参数
  // forbidUnknownValues: true 禁止未知值
  // transform: true, // 是否转换
  // whitelist: true, // 是否过滤未知值
  // forbidNonWhitelisted: true, // 是否禁止未知值
  // transformOptions: { enableImplicitConversion: true }, // 转换选项
  // skipMissingProperties: true, // 是否跳过缺少的属性
  //具体细节可以看官方文档 https://docs.nestjs.com/techniques/validation
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: true, // 禁止未知值
    }),
  ); // 全局使用验证管道
  generateDocument(app);
  await app.listen(3000);
}
bootstrap();
```

### 基于 MD5 的文件指纹技术实现上传文件命名

> 文件指纹技术是一种用来解决文件重名的问题,例如: 上传了一个文件名为 a.jpg 的文件,如果不使用文件指纹技术,那么下次再上传一个文件名为 a.jpg 的文件,那么就会覆盖掉之前的文件,所以我们需要使用文件指纹技术来解决这个问题,文件指纹技术是一种用来生成文件名的技术,例如: a.jpg 的文件指纹是: 1234567890,那么我们就可以把文件名改成: 1234567890.jpg,这样就不会出现文件重名的问题了。

1. 在 cryptogram 文件中创建 方法

```ts
export function enCryptoFileMD5(buffer: Buffer) {
  const md5 = crypto.createHash('md5'); // 创建一个md5的实例
  md5.update(buffer); // 更新md5的值 update是把buffer的值更新到md5的实例中
  return md5.digest('hex'); // 返回md5的值 digest('hex')是把md5的值转换成16进制的值
}
```

2. 在 user.controller.ts 中使用

```ts

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  upload(@Req() req, @Body() uploadDto: UploadDTO, @UploadedFile() file) {
    console.log(req.body, uploadDto, file);
    console.log(enCryptoFileMD5(file.buffer));
  }
```

### 文件上传和图床功能

1. 在 shared 文件夹中创建 upload 文件夹中创建 upload.service.ts 文件

```zsh
pnpm i fs-extra
```

```ts
@Injectable()
export class UploadService {

  upload(file) {
    const uploadDir = (!!process.env.UPLOAD_DIR && process.env.UPLOAD_DIR !== "") ? process.env.UPLOAD_DIR : join(__dirname, '../../..', 'static/upload')

    //encodeDir 需要使用 fs-extra 这个包fs-extra 是fs的一个扩展包,用来创建文件夹
    await ensureDir(uploadDir) // 创建文件夹
    const sing = enCryptoFileMD5(file.buffer) // 获取文件指纹
    //extname 获取文件后缀 extname是node的一个方法,用来获取文件后缀
    const ext = extname(file.originalname) // 获取文件后缀
    const fileName = sign +"." +  ext // 文件名
    const uploadPath = uploadDir + "/" + fileName // 文件路径

    await outputFile(uploadPath, file.buffer) // 把文件写入到文件夹中

    return {
      url: "/static/upload/" + fileName // 返回文件的路径
      path: uploadPath // 返回文件的绝对路径
    }
  }
}
```

2. 配置环境变量

```zsh
UPLOAD_DIR=static/upload
```

3. 在 sharedModule 中导入 UploadService

```ts
@Module({
  imports: [ConfigModule.forRoot(configModuleOptions), AppLoggerModule],
  providers: [SystemService, ...DatabaseProviders, UploadService],
  exports: [SystemService, ConfigModule, ...DatabaseProviders, AppLoggerModule, UploadService],
})
```

4. 在 UserService 中注入

```ts
async uploadAvatar(file) {
 const {url} = await this.uploadService.upload(file)
 return {data: url}
}
```

5. 在 UserController 中使用

```ts

upload(file) {
 return this.userService.uploadAvatar(file)
}

```


6. 提供静态服务

```ts
//在 main.ts 中
 const uploadDir = (!!process.env.UPLOAD_DIR && process.env.UPLOAD_DIR !== "") ? process.env.UPLOAD_DIR : join(__dirname, '../../..', 'static/upload')

app.useStaticAssets(uploadDir, {
  prefix: '/static/upload', // 静态服务的前缀
});
```
```
