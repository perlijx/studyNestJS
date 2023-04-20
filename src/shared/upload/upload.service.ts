import { Injectable } from '@nestjs/common';
import { extname, join } from 'path';
import { ensureDir, outputFile } from 'fs-extra';
import { enCryptoFileMD5 } from '../utils/cryptogram.util';
@Injectable()
export class UploadService {
  async upload(file) {
    const uploadDir =
      !!process.env.UPLOAD_DIR && process.env.UPLOAD_DIR !== ''
        ? process.env.UPLOAD_DIR
        : join(__dirname, '../../../../', 'static/upload');

    await ensureDir(uploadDir);
    const sing = enCryptoFileMD5(file.buffer);
    const ext = extname(file.originalname);
    const fileName = sing + '.' + ext;
    const uploadPath = uploadDir + '/' + fileName;
    await outputFile(uploadPath, file.buffer);

    return {
      url: '/static/upload/' + fileName,
      path: uploadPath,
    };
  }
}
