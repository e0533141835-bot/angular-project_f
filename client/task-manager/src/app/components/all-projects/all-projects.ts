import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ProjectsService } from '../../services/projects.service';
@Component({
  selector: 'app-all-projects',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './all-projects.html',
  styleUrl: './all-projects.css'
})
export class AllProjectsComponent implements OnInit {
  projectsService = inject(ProjectsService);
  searchQuery = signal<string>('');
  searchControl = new FormControl('');
  filteredProjects = computed(() => {
    const all = this.projectsService.myProjects();
    const text = this.searchQuery().toLowerCase();
    return all.filter(p => p.name.toLowerCase().includes(text));
  });
  ngOnInit() {
    this.projectsService.loadProjects();
  }
  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }
}