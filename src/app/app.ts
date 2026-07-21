import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConversationHubService } from './core/conversation-hub.service';
import { HumanRequestedAlert } from './core/models';

interface Toast extends HumanRequestedAlert {
  toastId: number;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected title = 'whatsapp-admin-client';
  readonly toasts = signal<Toast[]>([]);

  private nextToastId = 1;
  private readonly subscriptions = new Subscription();

  constructor(
    private readonly hub: ConversationHubService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    // Visível em qualquer tela do painel, não só dentro de uma conversa —
    // é por isso que o alerta é global (Clients.All) e não por grupo.
    this.subscriptions.add(
      this.hub.onHumanRequested.subscribe((alert) => {
        this.toasts.update((current) => [...current, { ...alert, toastId: this.nextToastId++ }]);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  openConversation(toast: Toast): void {
    this.dismiss(toast.toastId);
    this.router.navigate(['/contatos', toast.contactId]);
  }

  dismiss(toastId: number): void {
    this.toasts.update((current) => current.filter((t) => t.toastId !== toastId));
  }
}
