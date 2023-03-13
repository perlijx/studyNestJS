import { PartialType } from '@nestjs/mapped-types';
import { CreateUser4Dto } from './create-user4.dto';

export class UpdateUser4Dto extends PartialType(CreateUser4Dto) {}
