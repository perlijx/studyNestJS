import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationParamsDto {
  @ApiPropertyOptional({
    //  @ApiPropertyOptional() 用于可选参数
    description: 'PageSize , default is 100',
    type: Number,
    example: 5, //  example:5  用于展示示例
  })
  pageSize = 5;

  @ApiPropertyOptional({
    description: 'Page, defaults to 0',
    type: Number,
    example: 1,
  })
  page = 1;
}
