/*
 * @Author: perli 1003914407@qq.com
 * @Date: 2023-03-21 14:45:03
 * @LastEditors: perli 1003914407@qq.com
 * @LastEditTime: 2023-03-24 15:33:12
 * @FilePath: /nest/admin-server/src/shared/config/configuration.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export default (): any => ({
  env: process.env.APP_ENV,
  port: process.env.APP_PORT,
  database: {
    url: process.env.DB_URL,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    synchronize: process.env.DB_SYNCHRONIZE,
    logging: process.env.DB_LOGGING,
  },
});
