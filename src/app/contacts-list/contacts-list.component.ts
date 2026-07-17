import { DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Contact } from '../core/models';
import { ContactsService } from '../core/contacts.service';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-contacts-list',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './contacts-list.component.html',
  styleUrl: './contacts-list.component.css'
})
export class ContactsListComponent implements OnInit {
  readonly contacts = signal<Contact[]>([]);
  readonly loading = signal(true);

  constructor(
    private readonly contactsService: ContactsService,
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.contacts.set(await this.contactsService.listContacts());
    this.loading.set(false);
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
