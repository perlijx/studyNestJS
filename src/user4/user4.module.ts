import { Module } from '@nestjs/common';
import { User4Service } from './user4.service';
import { User4Controller } from './user4.controller';

@Module({
  controllers: [User4Controller],
  providers: [User4Service]
})
export class User4Module {}
