import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { TranslationResource } from './models';

export interface TranslationResourceForm {
  locale: string;
  namespace: string;
  contentJson: string;
}

@Injectable({ providedIn: 'root' })
export class TranslationsService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  list(): Promise<TranslationResource[]> {
    return firstValueFrom(this.http.get<TranslationResource[]>(`${this.baseUrl}/admin/translations`));
  }

  create(form: TranslationResourceForm): Promise<TranslationResource> {
    return firstValueFrom(this.http.post<TranslationResource>(`${this.baseUrl}/admin/translations`, form));
  }

  update(id: number, form: TranslationResourceForm): Promise<TranslationResource> {
    return firstValueFrom(this.http.put<TranslationResource>(`${this.baseUrl}/admin/translations/${id}`, form));
  }

  remove(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.baseUrl}/admin/translations/${id}`));
  }
}
