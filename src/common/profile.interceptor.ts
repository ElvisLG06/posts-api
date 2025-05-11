import { Injectable } from '@nestjs/common';
import { ExecutionContext, CallHandler, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ProfileInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();

    // Extraer el 'X-Profile-ID' de los headers
    const profileId = request.headers['x-profile-id'];

    // Si el profileId está presente, lo agregamos al objeto `req.user`
    if (profileId) {
      request.user = { profileId };
    }

    // Pasamos la solicitud al siguiente interceptor o controlador
    return next.handle();
  }
}
