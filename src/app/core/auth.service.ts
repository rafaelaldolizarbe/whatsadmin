import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = environment.apiBaseUrl;

  // Só reflete o estado desta aba/sessão do navegador — a fonte da verdade de
  // autenticação de fato é o cookie de sessão validado pelo backend a cada chamada.
  readonly isAuthenticated = signal(false);

  constructor(private readonly http: HttpClient) {}

  async login(email: string, password: string): Promise<boolean> {
    try {
      await firstValueFrom(this.http.post(`${this.baseUrl}/admin/login`, { email, password }));
      this.isAuthenticated.set(true);
      return true;
    } catch {
      this.isAuthenticated.set(false);
      return false;
    }
  }

  async logout(): Promise<void> {
    await firstValueFrom(this.http.post(`${this.baseUrl}/admin/logout`, {}));
    this.isAuthenticated.set(false);
  }
}
