import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { ConversationHubService } from './conversation-hub.service';

// O sinal do AuthService só existe em memória (some ao recarregar a página),
// então o guard confirma com o backend via /admin/session — é o cookie de
// sessão quem manda, não o estado local do navegador.
export const authGuard: CanActivateFn = async () => {
  const http = inject(HttpClient);
  const auth = inject(AuthService);
  const router = inject(Router);
  const hub = inject(ConversationHubService);

  try {
    await firstValueFrom(http.get(`${environment.apiBaseUrl}/admin/session`));
    auth.isAuthenticated.set(true);
    // Abre o canal de alertas globais aqui — não só quando uma conversa é
    // aberta —, senão "Falar com o Rafael" só notificaria quem já estivesse
    // na tela daquele contato específico.
    void hub.connect();
    return true;
  } catch {
    auth.isAuthenticated.set(false);
    return router.parseUrl('/login');
  }
};
