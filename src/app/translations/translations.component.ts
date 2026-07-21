import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslationResource } from '../core/models';
import { TranslationResourceForm, TranslationsService } from '../core/translations.service';

const emptyForm: TranslationResourceForm = { locale: 'pt', namespace: '', contentJson: '{\n  \n}' };

@Component({
  selector: 'app-translations',
  standalone: true,
  imports: [FormsModule, RouterLink, DatePipe],
  templateUrl: './translations.component.html',
  styleUrl: './translations.component.css'
})
export class TranslationsComponent implements OnInit {
  readonly resources = signal<TranslationResource[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  editingId: number | null = null;
  form: TranslationResourceForm = { ...emptyForm };

  constructor(private readonly translations: TranslationsService) {}

  async ngOnInit(): Promise<void> {
    await this.reload();
    this.loading.set(false);
  }

  private async reload(): Promise<void> {
    this.resources.set(await this.translations.list());
  }

  edit(resource: TranslationResource): void {
    this.editingId = resource.id;
    this.form = {
      locale: resource.locale,
      namespace: resource.namespace,
      contentJson: JSON.stringify(JSON.parse(resource.contentJson), null, 2)
    };
    this.error.set(null);
  }

  cancelEdit(): void {
    this.editingId = null;
    this.form = { ...emptyForm };
    this.error.set(null);
  }

  async submit(): Promise<void> {
    this.error.set(null);

    try {
      JSON.parse(this.form.contentJson);
    } catch {
      this.error.set('O JSON digitado é inválido — confira vírgulas e chaves.');
      return;
    }

    try {
      if (this.editingId === null) {
        await this.translations.create(this.form);
      } else {
        await this.translations.update(this.editingId, this.form);
      }
      this.cancelEdit();
      await this.reload();
    } catch (err) {
      const message = err instanceof HttpErrorResponse && err.error?.error
        ? err.error.error
        : 'Não foi possível salvar.';
      this.error.set(message);
    }
  }

  async remove(id: number): Promise<void> {
    await this.translations.remove(id);
    await this.reload();
  }
}
