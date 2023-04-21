import { AuthService } from './../services/auth.service';
import {
  BaseApiErrorResponse,
  SwaggerBaseApiResponse,
} from '@/shared/dtos/base-api-responest';
import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDTO } from '../dtos/auth.dto';
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
}
