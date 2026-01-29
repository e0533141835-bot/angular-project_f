import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute , RouterLink} from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectsService } from '../../services/projects.service';
import { Project } from '../../models/types.model';
@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, RouterLink],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css'
})
export class ProjectList implements OnInit {
  projectsService = inject(ProjectsService);
  route = inject(ActivatedRoute);
  currentTeamId = signal<string>('');
  isCreateOpen = signal(false);
  editingProjectId = signal<string | null>(null);
  projectForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('')
  });
  teamProjects = computed(() => {
    const allProjects = this.projectsService.myProjects();
    const teamId = this.currentTeamId();
    return allProjects.filter(p => String(p.team_id) === String(teamId));
  });
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('team_id');
    if (id) {
      this.currentTeamId.set(id);
    }
    this.projectsService.loadProjects();
  }
  openCreate() {
    this.editingProjectId.set(null);
    this.projectForm.reset();
    this.isCreateOpen.set(true);
  }
  openEdit(project: Project, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.editingProjectId.set(project.id);
    this.projectForm.setValue({
      name: project.name,
      description: project.description || ''
    });
    this.isCreateOpen.set(true);
  }
  closeModal() {
    this.isCreateOpen.set(false);
    this.editingProjectId.set(null);
    this.projectForm.reset();
  }
  saveProject() {
    if (this.projectForm.invalid) return;
    const { name, description } = this.projectForm.value;
    const teamId = this.currentTeamId();
    const projectId = this.editingProjectId();
    if (projectId) {
      this.projectsService.updateProject(projectId, { name: name!, description: description! })
        .subscribe({
          next: () => this.closeModal(),
          error: () => alert('שגיאה בעדכון הפרויקט')
        });
    } else {
      this.projectsService.addProject(teamId, name!, description!).subscribe({
        next: () => this.closeModal(),
        error: () => alert('שגיאה ביצירת הפרויקט')
      });
    }
  }
  deleteProject(project: Project, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    if (confirm(`Are you sure you want to delete "${project.name}"?`)) {
      this.projectsService.deleteProject(project.id).subscribe();
    }
  }
}