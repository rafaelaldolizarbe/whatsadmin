import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BotSettings } from '../core/models';
import { ContentService } from '../core/content.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  readonly loading = signal(true);
  readonly saved = signal(false);
  form: Omit<BotSettings, 'id'> = { greetingText: '', aboutMeText: '', contactConfirmationText: '' };

  constructor(private readonly content: ContentService) {}

  async ngOnInit(): Promise<void> {
    const settings = await this.content.getSettings();
    this.form = {
      greetingText: settings.greetingText,
      aboutMeText: settings.aboutMeText,
      contactConfirmationText: settings.contactConfirmationText
    };
    this.loading.set(false);
  }

  async submit(): Promise<void> {
    this.saved.set(false);
    await this.content.updateSettings(this.form);
    this.saved.set(true);
  }
}
