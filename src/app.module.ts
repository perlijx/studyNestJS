import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User1Controller } from './user1/user1.controller';
import { User2Service } from './user2/user2.service';
import { User4Module } from './user4/user4.module';

@Module({
  imports: [UserModule, User4Module],
  controllers: [AppController, User1Controller],
  providers: [AppService, User2Service],
})
export class AppModule {}
