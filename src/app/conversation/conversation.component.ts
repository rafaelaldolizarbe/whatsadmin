import { DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Message } from '../core/models';
import { ContactsService } from '../core/contacts.service';

@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.css'
})
export class ConversationComponent implements OnInit {
  readonly messages = signal<Message[]>([]);
  readonly loading = signal(true);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly contactsService: ContactsService
  ) {}

  async ngOnInit(): Promise<void> {
    const contactId = Number(this.route.snapshot.paramMap.get('id'));
    this.messages.set(await this.contactsService.getMessages(contactId));
    this.loading.set(false);
  }
}
