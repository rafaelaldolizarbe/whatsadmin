import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { BotSettings, Project } from './models';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  listProjects(): Promise<Project[]> {
    return firstValueFrom(this.http.get<Project[]>(`${this.baseUrl}/admin/projects`));
  }

  createProject(project: Omit<Project, 'id'>): Promise<Project> {
    return firstValueFrom(this.http.post<Project>(`${this.baseUrl}/admin/projects`, project));
  }

  updateProject(id: number, project: Omit<Project, 'id'>): Promise<Project> {
    return firstValueFrom(this.http.put<Project>(`${this.baseUrl}/admin/projects/${id}`, project));
  }

  deleteProject(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.baseUrl}/admin/projects/${id}`));
  }

  getSettings(): Promise<BotSettings> {
    return firstValueFrom(this.http.get<BotSettings>(`${this.baseUrl}/admin/settings`));
  }

  updateSettings(settings: Omit<BotSettings, 'id'>): Promise<BotSettings> {
    return firstValueFrom(this.http.put<BotSettings>(`${this.baseUrl}/admin/settings`, settings));
  }
}
