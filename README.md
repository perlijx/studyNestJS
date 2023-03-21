<!--
 * @Author: perli 1003914407@qq.com
 * @Date: 2023-03-13 15:34:51
 * @LastEditors: perli 1003914407@qq.com
 * @LastEditTime: 2023-03-21 18:31:26
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
pnpm i typeORM
```

2. 创建数据源

>在/src/shared 中创建 database.providers.ts 文件

```ts
import {ConfigService} from "nestjs/config"
import {DataSource, DataSourceOptions} from "typeORM"
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


3. 在要使用mongodb 的模块中创建数据仓库来声明使用了那几个表

> 在/src/user 创建 user.providers.ts 文件

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