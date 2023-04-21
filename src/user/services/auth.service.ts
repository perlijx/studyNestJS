import { LoginDTO } from './../dtos/auth.dto';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongoRepository } from 'typeorm';
import { User } from '../entities/user.mongo.entity';
import { encryptoPassword } from '@/shared/utils/cryptogram.util';
Injectable();
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: MongoRepository<User>,
  ) {}

  async login(loginDto: LoginDTO) {
    const user = await this.checkLoginForm(loginDto);
    const token = await this.certificate(user);
    return { data: token };
  }
  async certificate(user: User) {
    const payload = {
      id: user._id,
    };
    return this.jwtService.sign(payload);
  }
  async checkLoginForm(loginDto: LoginDTO) {
    const { phoneNumber, password } = loginDto;
    debugger;
    const user = await this.userRepository.findOneBy({ phoneNumber });
    if (!user) throw new NotFoundException('用户不存在');
    const { password: dbPassword, salt } = user;

    const hashPassword = encryptoPassword(salt, password);
    console.log(dbPassword, salt);
    console.log(hashPassword);
    if (hashPassword != dbPassword) throw new NotFoundException('密码错误');
    return user;
  }
}
