import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Contact, Message } from './models';

@Injectable({ providedIn: 'root' })
export class ContactsService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  listContacts(): Promise<Contact[]> {
    return firstValueFrom(this.http.get<Contact[]>(`${this.baseUrl}/admin/contacts`));
  }

  getContact(contactId: number): Promise<Contact> {
    return firstValueFrom(this.http.get<Contact>(`${this.baseUrl}/admin/contacts/${contactId}`));
  }

  getMessages(contactId: number): Promise<Message[]> {
    return firstValueFrom(this.http.get<Message[]>(`${this.baseUrl}/admin/contacts/${contactId}/messages`));
  }

  sendMessage(contactId: number, text: string): Promise<void> {
    return firstValueFrom(this.http.post<void>(`${this.baseUrl}/admin/contacts/${contactId}/messages`, { text }));
  }

  setTakeover(contactId: number, enabled: boolean): Promise<void> {
    const action = enabled ? 'takeover' : 'release';
    return firstValueFrom(this.http.post<void>(`${this.baseUrl}/admin/contacts/${contactId}/${action}`, {}));
  }

  dismissAttention(contactId: number): Promise<void> {
    return firstValueFrom(this.http.post<void>(`${this.baseUrl}/admin/contacts/${contactId}/dismiss-attention`, {}));
  }
}
