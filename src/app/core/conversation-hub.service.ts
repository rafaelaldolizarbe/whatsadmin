import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { HumanRequestedAlert, Message } from './models';

export interface MessageStatusUpdate {
  messageId: number;
  status: string | null;
}

// Uma única conexão de WebSocket compartilhada — o usuário só olha uma
// conversa por vez, então um Hub singleton com "grupos" por contato basta.
// O alerta de "quer falar com você" é global (Clients.All no backend), por
// isso a conexão é aberta assim que o usuário loga (ver authGuard), não só
// quando ele abre uma conversa específica — senão perderia o alerta.
@Injectable({ providedIn: 'root' })
export class ConversationHubService {
  private connection: signalR.HubConnection | null = null;

  private readonly messageReceived$ = new Subject<Message>();
  private readonly statusUpdated$ = new Subject<MessageStatusUpdate>();
  private readonly humanRequested$ = new Subject<HumanRequestedAlert>();

  readonly onMessageReceived = this.messageReceived$.asObservable();
  readonly onStatusUpdated = this.statusUpdated$.asObservable();
  readonly onHumanRequested = this.humanRequested$.asObservable();

  private async ensureConnected(): Promise<signalR.HubConnection> {
    if (!this.connection) {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(`${environment.apiBaseUrl}/hubs/conversation`, { withCredentials: true })
        .withAutomaticReconnect()
        .build();

      this.connection.on('messageReceived', (message: Message) => this.messageReceived$.next(message));
      this.connection.on('messageStatusUpdated', (update: MessageStatusUpdate) => this.statusUpdated$.next(update));
      this.connection.on('humanRequested', (alert: HumanRequestedAlert) => this.humanRequested$.next(alert));
    }

    if (this.connection.state === signalR.HubConnectionState.Disconnected) {
      await this.connection.start();
    }

    return this.connection;
  }

  // Chamado uma vez, logo após o login/confirmação de sessão (authGuard) —
  // garante que o canal de alertas globais já esteja de pé em qualquer tela.
  connect(): Promise<signalR.HubConnection> {
    return this.ensureConnected();
  }

  async joinContact(contactId: number): Promise<void> {
    const connection = await this.ensureConnected();
    await connection.invoke('JoinContact', contactId);
  }

  async leaveContact(contactId: number): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke('LeaveContact', contactId);
    }
  }
}
