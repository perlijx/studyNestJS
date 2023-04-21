import { regMobileCN } from '@/shared/utils/regex.util';
import { ApiProperty } from '@nestjs/swagger';
import { Matches, IsNotEmpty } from 'class-validator';

export class LoginDTO {
  @Matches(regMobileCN, { message: '手机号码不正确' })
  @IsNotEmpty({ message: '请输入手机号' })
  @ApiProperty({ description: '手机号码', example: '18888888888' })
  readonly phoneNumber: string;
  @IsNotEmpty({ message: '密码不能为空' })
  @ApiProperty({ description: '密码', example: '123456' })
  readonly password: string;
}
