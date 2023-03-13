import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { User4Service } from './user4.service';
import { CreateUser4Dto } from './dto/create-user4.dto';
import { UpdateUser4Dto } from './dto/update-user4.dto';

@Controller('user4')
export class User4Controller {
  constructor(private readonly user4Service: User4Service) {}

  @Post()
  create(@Body() createUser4Dto: CreateUser4Dto) {
    return this.user4Service.create(createUser4Dto);
  }

  @Get()
  findAll() {
    return this.user4Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.user4Service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUser4Dto: UpdateUser4Dto) {
    return this.user4Service.update(+id, updateUser4Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.user4Service.remove(+id);
  }
}
