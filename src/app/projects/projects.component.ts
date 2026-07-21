import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Project } from '../core/models';
import { ContentService } from '../core/content.service';

type ProjectForm = Omit<Project, 'id'>;

const emptyForm: ProjectForm = { title: '', shortDescription: '', detailsText: '', displayOrder: 1 };

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {
  readonly projects = signal<Project[]>([]);
  readonly loading = signal(true);
  editingId: number | null = null;
  form: ProjectForm = { ...emptyForm };

  constructor(private readonly content: ContentService) {}

  async ngOnInit(): Promise<void> {
    await this.reload();
    this.loading.set(false);
  }

  private async reload(): Promise<void> {
    this.projects.set(await this.content.listProjects());
  }

  edit(project: Project): void {
    this.editingId = project.id;
    this.form = {
      title: project.title,
      shortDescription: project.shortDescription,
      detailsText: project.detailsText,
      displayOrder: project.displayOrder
    };
  }

  cancelEdit(): void {
    this.editingId = null;
    this.form = { ...emptyForm };
  }

  async submit(): Promise<void> {
    if (this.editingId === null) {
      await this.content.createProject(this.form);
    } else {
      await this.content.updateProject(this.editingId, this.form);
    }

    this.cancelEdit();
    await this.reload();
  }

  async remove(id: number): Promise<void> {
    await this.content.deleteProject(id);
    await this.reload();
  }
}
