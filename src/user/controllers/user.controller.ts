import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
/*
 * @Author: perli 1003914407@qq.com
 * @Date: 2023-03-16 10:51:51
 * @LastEditors: perli 1003914407@qq.com
 * @LastEditTime: 2023-03-27 16:34:11
 * @FilePath: /nest/admin-server/src/user/controllers/user.controller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { ConfigService } from '@nestjs/config';
import { PaginationParamsDto } from '@/shared/dtos/pagination-params';

@Controller('user')
@ApiTags('用户中心')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}
  @ApiOperation({
    summary: '新增用户',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateUserDto,
  })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    console.log('env:url', this.configService.get<string>('database.url'));

    return this.userService.create(createUserDto);
  }
  @ApiOperation({
    summary: '查询所有用户', // 操作描述
  })
  @Get()
  async findAll(@Query() query: PaginationParamsDto) {
    // @Query() 用于获取get请求参数

    const { data, count } = await this.userService.findAll(query);
    return {
      data,
      meta: { total: count },
    };
  }
  @ApiOperation({
    summary: '查询单个用户',
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }
  @ApiOperation({
    summary: '更新单个用户',
  })
  @Patch(':id') // @Patch() 用于更新数据
  // @Param() 用于获取路由参数
  // @Body() 用于获取请求体
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return {
      data: await this.userService.update(id, updateUserDto),
    };
  }
  @ApiOperation({
    summary: '删除单个用户',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT, //
  }) // 用于描述接口返回的数据结构
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
