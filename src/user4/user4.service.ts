import { Injectable } from '@nestjs/common';
import { CreateUser4Dto } from './dto/create-user4.dto';
import { UpdateUser4Dto } from './dto/update-user4.dto';

@Injectable()
export class User4Service {
  create(createUser4Dto: CreateUser4Dto) {
    return 'This action adds a new user4';
  }

  findAll() {
    return `This action returns all user4`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user4`;
  }

  update(id: number, updateUser4Dto: UpdateUser4Dto) {
    return `This action updates a #${id} user4`;
  }

  remove(id: number) {
    return `This action removes a #${id} user4`;
  }
}
