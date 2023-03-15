<!--
 * @Author: perli 1003914407@qq.com
 * @Date: 2023-03-13 15:34:51
 * @LastEditors: perli 1003914407@qq.com
 * @LastEditTime: 2023-03-15 18:31:09
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

import * as packageConfig from "../package.json"



```
