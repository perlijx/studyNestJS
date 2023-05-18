import { AuthService } from './../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import {
  BaseApiErrorResponse,
  SwaggerBaseApiResponse,
} from '@/shared/dtos/base-api-responest';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDTO } from '../dtos/auth.dto';
import { UserInfoDto } from '../dtos/user-info.dto';
@ApiTags('权限控制')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({ summary: '用户登录' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(LoginDTO),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @Post('login')
  login(@Body() loginDto: LoginDTO): Promise<any> {
    return this.authService.login(loginDto);
  }
  @ApiOperation({ summary: '获取用户信息' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(UserInfoDto),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('info')
  async info(@Req() req: any): Promise<any> {
    const data = await this.authService.info(req.user.id);
    delete data.password;
    delete data.salt;
    return { data };
  }
}
