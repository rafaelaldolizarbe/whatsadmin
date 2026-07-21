import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'contatos' },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'contatos',
    canActivate: [authGuard],
    loadComponent: () => import('./contacts-list/contacts-list.component').then(m => m.ContactsListComponent)
  },
  {
    path: 'contatos/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./conversation/conversation.component').then(m => m.ConversationComponent)
  },
  {
    path: 'projetos',
    canActivate: [authGuard],
    loadComponent: () => import('./projects/projects.component').then(m => m.ProjectsComponent)
  },
  {
    path: 'configuracoes',
    canActivate: [authGuard],
    loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent)
  },
  {
    path: 'traducoes',
    canActivate: [authGuard],
    loadComponent: () => import('./translations/translations.component').then(m => m.TranslationsComponent)
  }
];
