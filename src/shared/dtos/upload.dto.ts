import { ApiProperty } from '@nestjs/swagger';

export class UploadDTO {
  @ApiProperty({
    description: '文件',
    type: 'string',
    example: 'xx文件',
  })
  name: string;
  @ApiProperty({
    description: '文件',
    type: 'string',
    format: 'binary',
    required: true,
  })
  file: Express.Multer.File;
}
