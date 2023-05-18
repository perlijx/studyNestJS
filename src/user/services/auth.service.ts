import { Role } from './../entities/role.mongo.entity';
import { LoginDTO } from './../dtos/auth.dto';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongoRepository } from 'typeorm';
import { User } from '../entities/user.mongo.entity';
import { encryptoPassword } from '@/shared/utils/cryptogram.util';
import { UserInfoDto } from '../dtos/user-info.dto';
Injectable();
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('USER_REPOSITORY')
    private userRepository: MongoRepository<User>,
    @Inject('ROLE_REPOSITORY')
    private roleRepository: MongoRepository<Role>,
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
    const user = await this.userRepository.findOneBy({ phoneNumber });
    if (!user) throw new NotFoundException('用户不存在');
    const { password: dbPassword, salt } = user;

    const hashPassword = encryptoPassword(salt, password);
    console.log(dbPassword, salt);
    console.log(hashPassword);
    if (hashPassword != dbPassword) throw new NotFoundException('密码错误');
    return user;
  }
  async info(id: string) {
    const user = await this.userRepository.findOneBy(id);
    const data: UserInfoDto = Object.assign({}, user);
    if (user.role) {
      const role = await this.roleRepository.findOneBy(user.role);
      if (role) data.permissions = role.permissions;
    }
    return data;
  }
}
