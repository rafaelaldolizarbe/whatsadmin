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

  getMessages(contactId: number): Promise<Message[]> {
    return firstValueFrom(this.http.get<Message[]>(`${this.baseUrl}/admin/contacts/${contactId}/messages`));
  }
}
