import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Contact, Message } from '../core/models';
import { ContactsService } from '../core/contacts.service';
import { ConversationHubService } from '../core/conversation-hub.service';

@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [RouterLink, DatePipe, FormsModule],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.css'
})
export class ConversationComponent implements OnInit, OnDestroy {
  contactId!: number;
  readonly contact = signal<Contact | null>(null);
  readonly messages = signal<Message[]>([]);
  readonly loading = signal(true);
  readonly sending = signal(false);
  draftText = '';

  @ViewChild('bottomSentinel') private bottomSentinel?: ElementRef<HTMLDivElement>;

  private readonly subscriptions = new Subscription();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly contactsService: ContactsService,
    private readonly hub: ConversationHubService
  ) {}

  async ngOnInit(): Promise<void> {
    this.contactId = Number(this.route.snapshot.paramMap.get('id'));
    await this.reload();
    this.loading.set(false);
    this.scrollToBottom();

    // Abrir a conversa já conta como "visto" — some o selo de "quer falar com você".
    if (this.contact()?.needsHumanAttention) {
      await this.contactsService.dismissAttention(this.contactId);
      this.contact.update((c) => (c ? { ...c, needsHumanAttention: false } : c));
    }

    // Depois da carga inicial via REST, o resto chega ao vivo pelo SignalR —
    // sem precisar dar F5 pra ver mensagem nova ou status de entrega mudando.
    this.subscriptions.add(
      this.hub.onMessageReceived.subscribe((message) => {
        this.appendMessage(message);
        this.scrollToBottom(true);
      })
    );
    this.subscriptions.add(
      this.hub.onStatusUpdated.subscribe(({ messageId, status }) => this.updateStatus(messageId, status))
    );

    await this.hub.joinContact(this.contactId);
  }

  async ngOnDestroy(): Promise<void> {
    this.subscriptions.unsubscribe();
    await this.hub.leaveContact(this.contactId);
  }

  private appendMessage(message: Message): void {
    if (this.messages().some((m) => m.id === message.id)) {
      return; // já veio por outro caminho (ex.: recarga manual) — evita duplicar
    }

    this.messages.update((current) => [...current, message]);
  }

  private updateStatus(messageId: number, status: string | null): void {
    this.messages.update((current) =>
      current.map((m) => (m.id === messageId ? { ...m, status } : m))
    );
  }

  // A conversa sempre foca na mensagem mais recente — igual qualquer app de chat.
  // setTimeout(0) espera o Angular terminar de renderizar a lista atualizada
  // antes de rolar, já que o DOM só reflete o novo signal no próximo ciclo.
  private scrollToBottom(smooth = false): void {
    setTimeout(() => {
      this.bottomSentinel?.nativeElement.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'end'
      });
    }, 0);
  }

  private async reload(): Promise<void> {
    const [contact, messages] = await Promise.all([
      this.contactsService.getContact(this.contactId),
      this.contactsService.getMessages(this.contactId)
    ]);
    this.contact.set(contact);
    this.messages.set(messages);
  }

  async toggleTakeover(): Promise<void> {
    const current = this.contact();
    if (!current) {
      return;
    }

    await this.contactsService.setTakeover(this.contactId, !current.humanTakeoverEnabled);
    this.contact.set({ ...current, humanTakeoverEnabled: !current.humanTakeoverEnabled });
  }

  async send(): Promise<void> {
    const text = this.draftText.trim();
    if (!text) {
      return;
    }

    this.sending.set(true);
    // Não recarrega a lista aqui — a mensagem enviada chega pelo SignalR
    // (mesmo caminho que uma mensagem do bot/webhook usaria).
    await this.contactsService.sendMessage(this.contactId, text);
    this.draftText = '';
    this.sending.set(false);
  }
}
