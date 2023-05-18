import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
export class RemoveSensitiveUserInfoInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((res) => {
        const delKeyList = ['password', 'salt'];
        this.delValue(res, delKeyList);
        return res;
      }),
    );
  }
  delValue(data, removeKeyList) {
    for (const key in data) {
      if (removeKeyList.includes(key)) {
        delete data[key];
      } else if (typeof data[key] == 'object') {
        this.delValue(data[key], removeKeyList);
      }
    }
  }
}
