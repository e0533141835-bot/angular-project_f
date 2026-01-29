import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TasksService } from '../../services/tasks.service';
@Component({
  selector: 'app-all-tasks',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './all-tasks.html',
  styleUrl: './all-tasks.css'
})
export class AllTasksComponent implements OnInit {
  tasksService = inject(TasksService);
  searchQuery = signal<string>('');
  searchControl = new FormControl('');
  filteredTasks = computed(() => {
    const all = this.tasksService.myTasks();
    const text = this.searchQuery().toLowerCase();
    return all.filter(task =>
      task.title.toLowerCase().includes(text) ||
      task.status.includes(text)
    );
  });
  ngOnInit() {
    this.tasksService.loadTasks();
  }
  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }
}