<!--
 * @Author: perli 1003914407@qq.com
 * @Date: 2023-03-13 15:34:51
 * @LastEditors: perli 1003914407@qq.com
 * @LastEditTime: 2023-03-28 10:21:03
 * @FilePath: /nest/admin-server/README.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

### 创建项目 

- ```nest new xxx``` 命令创建项目
- ```nest go mo xxxx``` 创建 Module
-   ```nest go s xxxx``` 创建 service
- ```nest go co xxxx```  创controller
- ```nest go co xxxx``` 创建-套Restful风格接口


### 创建 Swagger 文档

1. 安装插件 ```pnpm i @nestjs/swagger```

2. 在```src```文件夹下创建```doc.ts``` 文件

```ts
import {SwaggerModule,DocumentBuilder} from "@nestjs/swagger"

import * as packageConfig from "../package.json" //从package.json文件中导出项目的信息

export const generateDocument = (app) => {
  const options = new DocumentBuilder()
                  .setTitle(packageConfig.name) //设置标题
                  .setDescription(packageConfig.description) //设置描述
                  .setVersion(packageConfig.version) //设置版本
                  .addBearerAuth() //增加鉴权功能
                  .build()
  const document = SwaggerModule.createDocument(app, options) 
  SwaggerModule.setUp("/api/doc", app, document)               
}
```

3. 在Ts 中要导入 json 需要在 TS.config.json 中配置
```json
{
  "compilerOptions": {
    "resolveJsonModule": true
  }
}
```

4.  在项目的main.js 中配置 swagger

```ts
 import {generateDocument} from "./doc"
 async function bootstrap () {
  //创建文档
  generateDocument(app)
  await app.listen(3000, "0.0.0.0")
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


### Controller 与 Http接口实现 实现

 Controller 负责处理输入的request请求并向客户端进行相应

![mvc模型](https://secure2.wostatic.cn/static/8YzGDxVZUX9Cp1NJdeS1Ea/image.png?auth_key=1678936546-n1S5Gzk78F6PdpwTaeU9v7-0-ac537243e83e7d7153d73107813a1d95&image_process=resize,w_441&file_size=167877)

 dto

 数据传输对象
 DTO 是一组需要跨进程或网络边界传输的聚合数据的简单容器。它不应该包含业务逻辑，并将其行为限制为诸如内部一致性检查和基本验证之类的活动

 ##### 在nest 中写一个dto
1. 写一个dto文件
 ```ts
 import {ApiProperty} from "@nestjs/swagger"
export class CreateUserDto {

  /*
    手机号(系统唯一)
  */
  @ApiProperty({ //设置注释
    example: "15619235990" //设置实例
  }) 
  readonly phoneNumber: string;
  @ApiProperty({ //设置注释
    example: "123" //设置实例
  }) 
  password: string;
  @ApiProperty({ //设置注释
    example: "123@qq.com" //设置实例
  }) 
  email: string
}


 ```
 2. 在controller 中引入
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


在nestjs中也是使用了控制反转的思想项目的service层就是使用依赖注入的设计模式完成的
1. 创建一个user.service.ts 文件
```ts
import { Injectable } from '@nestjs/common';
class UserService {
  @Injectable()  //添加注解 表示这个方法可以被注入
  create(){

  }
}
```

2. 在module.ts 中把 user.service.ts 中的 service 提供给 整个 user 的所有类中
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


3. 在userController 中就可以直接使用这些被注入的 模块了
```ts
@Controller('user')
@ApiTags('用户中心')
export class UserController {
  constructor(private readonly userService: UserService  /*已经注入了*/) {}
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



### 用Module 实现模块化

之前我们使用 providers 和 injectable 实现了模块内部的交互
现在我们在学习使用 Module 模块来实现模块之间的交互

1. 创建shared文件夹和system.service.ts文件
```ts
 @Injectable()
export class SystemService {
  constructor() {}
 
  getEnv() {
    return {
      a:1
    }
  }
}
```

2. 在 shared 文件夹中 创建 shared.module.ts 文件
```ts
import {Module} from "@nestjs/common"
import {SystemService} from "./system.service"
@Module({
  provides: [SystemService],
  exports: [SystemService] //导出整个SystemService 模块
})
export class SharedModule {}
```


3. 在要使用该模块的模块的 Module的文件中引入整个shared 模块 就可以在该模块中使用的
```ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {SharedModule} from "../shared/shared"
@Module({
  controllers: [UserController],
  providers: [UserService],
  imports:[SharedModule]  //引入整个SharedModule 模块
})
export class UserModule {}
```

4. 在user.service.ts 文件中使用

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
### 在nest项目中抛出错误

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
export default ():any => ({
  env: process.env.APP_ENV,
  port: process.env.APP_PORT,
  database: {
    url: process.env.DB_URL,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    synchronize: process.env.DB_SYNCHRONIZE,
    logging: process.env.DB_LOGGING
  },
})
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


5. 注入Config 模块 在 /src/shared.module.ts
```ts
import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configModuleOptions } from './configs/module-options';

@Module({
    // 注入Config
    imports: [
        ConfigModule.forRoot(configModuleOptions),
    ],
     
    // 暴露Config
    exports: [
      ConfigModule,
    ]
    
})
export class ShareModule { }
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


###  TypeORM 数据持久化

typeORM 是 一个ORM框架[ORM定义](https://segmentfault.com/a/1190000011642533) ORM最常见使用便是对象与数据库之间的转换


在nest中使用

1. 安装 typeORM

```
pnpm i typeorm
pnpm i mongodb@^3.6.0
```

2. 创建数据源

>在/src/shared 中创建 database.providers.ts 文件

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
3. 在shared.module.ts 中注册
```ts
import { DatabaseProviders } from "./database.provides"

@Module({
  exports: [...DatabaseProviders]
  provides: [...DatabaseProviders]
})
```

4. 在要使用mongodb 的模块中创建数据仓库来声明使用了那几个表(创建dao层)

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

5. 在user的module.ts文件中注入刚创建好的UserProviders

```ts
import {UserProviders} from "./user.providers"

@Module({
  provide:[...UserProviders]
})
```


6. 在user/entities 文件中创建 user的mongo实体

```ts
import { Column, Entity,ObjectIdColumn, ObjectID } from "typeorm"
@Entity() //声明实体
export class User {
  @ObjectIdColumn()    //必须要一个主键
  _id:ObjectID     
  @Column("text")
  name:string
  @Column({length:200})
  email: string
}
```
7. 在userService 中使用 

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

8.  安装mongodb 注意安装版本为 mongodb@^3.6.0


### 使用 Winston 实现分级日志记录

##### 日志库的必要性

- 传输通道
    - Console 文件
    - File 文件
    - Http 通过http传输
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
    - `WARN`：_FBI WARNNING_大家都知道，就是警告，但又不到错误
    - `ERROR`：报错，一般程序报错使用该等级
    - `FATAL`：严重，比程序报错还严重的等级，如果没做错误等级划分的话，一般`FATAL`都不怎么用到，都用`ERROR`替代了


在nest中使用 Winston

1. 安装winston

```
pnpm i winston
```

2. 在/src/shared 中创建logger子模块文件夹创建 logger.service.ts 文件

```ts
import { Logger, LoggerOptions, transports } from "winston"

export class AppLogger {
  private logger: Logger
  private context?: string

  public setContext(context: string):void { //设置上下文
    this.context = context
  }
  constructor() {
    this.logger = createLogger({  //生成一个logger的工
      level: process.env.LOGGER_LEVEL || "info", //日志等级
      format: format.combine( //格式化
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), //时间戳
        format.prettyPrint(), //格式美化
      ),
      transports: [
        new transports.File({ filename: "logs/error.log", level: "error" }), //
        new transports.File({ filename: "logs/combined.log" }), //传输通道
        new transports.Console(), //控制台
      ],
      
    })
  }
  //日志等级
  error(ctx:any,message: string, meta?: Record<string, any> ): Logger { //错误
    return this.logger.error({
      message,//日志信息
      contextName: this.context,//上下文
      ctx, //上下文
      ...meta,//  
    })
  }
  warn(ctx:any,message: string, meta?: Record<string, any> ): Logger { //警告
    return this.logger.warn({
      message,
      contextName: this.context,
      ctx,
      ...meta,
    })
  }
  info(ctx:any,message: string, meta?: Record<string, any> ): Logger { //信息
        return this.logger.info({
          message,
          contextName: this.context,
          ctx,
          ...meta,
        })
      }
  debug(ctx:any,message: string, meta?: Record<string, any> ): Logger { //调试
    return this.logger.debug({
      message,
      contextName: this.context,
      ctx,
      ...meta,
    })
  }
}
```

3. 创建logger.module.ts 文件

```ts
import { Module } from "@nestjs/common"
import { AppLogger } from "./logger.service"

@Module({
  providers: [AppLogger],
  exports: [AppLogger]
})
export class AppLoggerModule {}
```

4. 在shared.module.ts 中注册

```ts
import { AppLoggerModule } from "./logger/logger.module"

@Module({
  imports: [AppLoggerModule],
  exports: [AppLoggerModule],
})
```

5. 在需要使用的地方注入

```ts

import { AppLogger } from "../shared/logger/logger.service"

@Injectable()
export class UserService {
  constructor(private readonly logger: AppLogger) {
    this.logger.setContext(UserService.name) //设置上下文
  }
  create(createUserDto: CreateUserDto) {
    this.logger.info( null, "创建用户",{a:123} ) //调用方法
    this.logger.debug( null, "创建用户",{a:123} ) //调用方法
    return this.userRepository.save({ //调用方法
      name:"张三",
      email:""
    })
  }
  findAll() {
    this.logger.info("查询用户")
    this.userRepository.findAndCount({})
  }
}
```


### 实现分页功能

1. 安装依赖

```
pnpm i class-transformer class-validator
```

//class-transformer 用于将对象转换为json对象
//class-validator 用于验证对象



2. 分页是一个通用的功能，所以我们在shared文件夹下创建一个dto文件夹，创建一个分页的dto文件

```ts
import { IsNumber, IsOptional, Min, Transform} from "class-validator" //验证什么类型的数据 IsOptional 可选的 IsNumber 数字类型

export class PaginationParamsDto {
  @ApiPropertyOptional({  //swagger文档 可选的   @ApiProperty 为必选
    description: "页码",
    type: Number, //类型
    example: 1, //示例  
  })
  @IsNumber() //验证是否为数字
  @IsOptional() //可选的
  @Min(0) //最小值
  @Transform(({value}) => parseInt(value, 10)) //转换为数字 Transform 转换器 value => Number(value) 为转换 器 value 为传入的值 Number(value) 为转换后的值  也可以自定义转换器 例如 value => value + 1 为传入的值加1  
  pageSize = 5
  @ApiPropertyOptional({  //swagger文档 可选的   @ApiProperty 为必选
    description: "页码",
    type: Number, //类型
    example: 1, //示例  
  })
  @IsNumber() //验证是否为数字
  @IsOptional() //可选的
  @Min(0) //最小值
  @Transform(({value}) => parseInt(value, 10)) 
  page = 1
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

3. 修改user.service.ts

```ts 
import { PaginationParamsDto } from "../shared/dto/pagination.dto"
class UserService {
  async findAll({pageSize,page}:PaginationParamsDto) :Promise<{data:User[],count:number}> { //使用解构赋值获取参数
      const [data, count] = await this.userRepository.findAndCount({
        order: { name: "DESC" }, //排序 降序
        take: (pageSize*1), //获取多少条
        skip: (page - 1) * pageSize, //跳过多少条计算逻辑为 页码-1 * 每页条数 意思是跳过之前的页码的数据
      })
      return {data, count}
    }
  
}
```



### 实现通用数据项-逻辑删除,时间戳

>在面向对象的编程中公共的属性和方法可以抽象出来，放到父类中，子类继承父类，就可以使用父类的属性和方法，这样就可以减少代码的重复，提高代码的复用性。在面向对象的编程中，我们可以使用抽象类来实现这个功能。

1. 在shared文件夹下创建一个entities文件夹,创建一个common.entity.ts文件

```ts
import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn,ObjectId,Column ,VersionColumn} from "typeorm"

export abstract class Common {
  @ObjectIdColumn() //主键
  _id:ObjectId
  @CreateDateColumn() //创建时间
  createAt: Date //创建时间
  @UpdateDateColumn() //更新时间
  updateAt: Date //更新时间
  @Column({
    default:false, //默认值
    select:false //查询时不显示
  })
  isDelete: boolean //是否删除
  @VersionColumn({
    select:false //查询时不显示
  }) //版本号
  version:number //版本号
}

```
2. 在user.entity.ts 中继承

```ts 

import { Common } from "../shared/entities/common.entity"
export class User extends Common {
  @Column()
  name: string
  @Column()
  email: string
  @Column()
  password: string
}
```


