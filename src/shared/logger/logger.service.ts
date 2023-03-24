/*
 * @Author: perli 1003914407@qq.com
 * @Date: 2023-03-24 17:25:04
 * @LastEditors: perli 1003914407@qq.com
 * @LastEditTime: 2023-03-24 17:54:35
 * @FilePath: /nest/admin-server/src/shared/logger/logger.service.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Logger, createLogger, format, transports } from 'winston';
export class AppLoggerService {
  private context?: string; //上下文
  private logger: Logger; //日志对象

  public setContext(context: string): void {
    this.context = context;
  }
  constructor() {
    this.logger = createLogger({
      level: process.env.LOGGER_LEVEL,
      format: format.combine(format.timestamp(), format.prettyPrint()),
      transports: [new trams()],
    });
  }
}
