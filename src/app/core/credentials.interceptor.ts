import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

// O cookie de sessão (autenticação por Identity no backend) só é enviado em
// requisições cross-origin se withCredentials estiver marcado — sem isso,
// toda chamada autenticada volta 401 mesmo com login válido.
export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith(environment.apiBaseUrl)) {
    return next(req.clone({ withCredentials: true }));
  }

  return next(req);
};
