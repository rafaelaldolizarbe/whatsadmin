import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  async submit(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    const ok = await this.auth.login(this.email, this.password);

    this.loading.set(false);
    if (ok) {
      this.router.navigateByUrl('/contatos');
    } else {
      this.error.set('E-mail ou senha inválidos.');
    }
  }
}
