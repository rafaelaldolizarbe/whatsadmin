import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Contact } from '../core/models';
import { ContactsService } from '../core/contacts.service';
import { AuthService } from '../core/auth.service';
import { ConversationHubService } from '../core/conversation-hub.service';

@Component({
  selector: 'app-contacts-list',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './contacts-list.component.html',
  styleUrl: './contacts-list.component.css'
})
export class ContactsListComponent implements OnInit, OnDestroy {
  readonly contacts = signal<Contact[]>([]);
  readonly loading = signal(true);

  private readonly subscriptions = new Subscription();

  constructor(
    private readonly contactsService: ContactsService,
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly hub: ConversationHubService
  ) {}

  async ngOnInit(): Promise<void> {
    this.contacts.set(await this.contactsService.listContacts());
    this.loading.set(false);

    // Selo "quer falar com você" atualiza sozinho aqui, mesmo sem sair desta
    // tela — não precisa estar dentro da conversa pra ver o alerta chegando.
    this.subscriptions.add(
      this.hub.onHumanRequested.subscribe(({ contactId }) => {
        this.contacts.update((current) =>
          current.map((c) => (c.id === contactId ? { ...c, needsHumanAttention: true } : c))
        );
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
