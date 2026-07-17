import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

// O sinal do AuthService só existe em memória (some ao recarregar a página),
// então o guard confirma com o backend via /admin/session — é o cookie de
// sessão quem manda, não o estado local do navegador.
export const authGuard: CanActivateFn = async () => {
  const http = inject(HttpClient);
  const auth = inject(AuthService);
  const router = inject(Router);

  try {
    await firstValueFrom(http.get(`${environment.apiBaseUrl}/admin/session`));
    auth.isAuthenticated.set(true);
    return true;
  } catch {
    auth.isAuthenticated.set(false);
    return router.parseUrl('/login');
  }
};
