/*
 * @Author: perli 1003914407@qq.com
 * @Date: 2023-03-24 17:25:04
 * @LastEditors: perli 1003914407@qq.com
 * @LastEditTime: 2023-03-24 18:07:10
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
      transports: [
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' }),
        new transports.Console(),
      ],
    });
  }
  error(ctx: any, message: string, meta?: Record<string, any>): Logger {
    return this.logger.error({
      message,
      contextName: this.context,
      ctx,
      ...meta,
    });
  }
  warn(ctx: any, message: string, meta?: Record<string, any>): Logger {
    return this.logger.warn({
      message,
      contextName: this.context,
      ctx,
      ...meta,
    });
  }
  info(ctx: any, message: string, meta?: Record<string, any>): Logger {
    return this.logger.info({
      message,
      contextName: this.context,
      ctx,
      ...meta,
    });
  }
  debug(ctx: any, message: string, meta?: Record<string, any>): Logger {
    return this.logger.debug({
      message,
      contextName: this.context,
      ctx,
      ...meta,
    });
  }
}
