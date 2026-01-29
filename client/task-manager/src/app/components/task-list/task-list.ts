import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TasksService } from '../../services/tasks.service';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../models/types.model';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { CommentsService } from '../../services/comments.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, RouterLink, DragDropModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList implements OnInit {
  tasksService = inject(TasksService);
  commentsService = inject(CommentsService);
  private route = inject(ActivatedRoute);

  projectId = signal<string>('');
  
  isCreateOpen = signal(false);

  editingTaskId = signal<string | null>(null);
  selectedTask = signal<Task | null>(null);
  searchQuery = signal('');
  
  taskForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    priority: new FormControl('normal'),
    dueDate: new FormControl('') 
  });

  commentControl = new FormControl('');

  todoTasks = computed(() => this.filterTasks('todo'));
  inProgressTasks = computed(() => this.filterTasks('in_progress'));
  doneTasks = computed(() => this.filterTasks('done'));

  private filterTasks(status: string) {
    const text = this.searchQuery().toLowerCase();
    return this.tasksService.myTasks().filter(t =>
      t.status === status &&
      (t.title.toLowerCase().includes(text) || t.description?.toLowerCase().includes(text))
    );
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('projectId');
    if (id) {
      this.projectId.set(id);
      this.tasksService.loadTasks(id);
    }
  }

  openCreate() {
    this.editingTaskId.set(null);
    this.selectedTask.set(null);
    this.taskForm.reset({ priority: 'normal', dueDate: '' });
    this.isCreateOpen.set(true);
    this.commentsService.currentComments.set([]);
  }

  openEdit(task: Task) {
    this.editingTaskId.set(task.id);
    this.selectedTask.set(task);

    // טיפול בתאריך (due_date מהשרת או dueDate מהלוקאלי)
    const serverDate = (task as any).due_date || task.dueDate;
    let formattedDate = '';
    if (serverDate) {
      formattedDate = String(serverDate).substring(0, 10);
    }

    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      priority: task.priority || 'normal',
      dueDate: formattedDate 
    });

    this.isCreateOpen.set(true);
    this.commentsService.loadComments(task.id);
  }

  closeModal() {
    this.isCreateOpen.set(false);
    this.editingTaskId.set(null);
    this.selectedTask.set(null);
    this.taskForm.reset();
    this.commentControl.reset();
  }

  saveTask() {
    if (this.taskForm.invalid) return;

    const formVal = this.taskForm.value;
    const rawDate = formVal.dueDate || null; 

    const currentProjectId = this.projectId();
    const taskId = this.editingTaskId();

    if (taskId) {
      // --- עדכון משימה ---
      const updatePayload = {
        title: formVal.title!,
        description: formVal.description!,
        priority: formVal.priority! as 'low'|'normal'|'high',
        due_date: rawDate, 
        status: this.selectedTask()?.status 
      };

      this.tasksService.updateTask(taskId, updatePayload).subscribe({
        next: () => this.closeModal(),
        error: (err) => console.error('Update failed', err)
      });

    } else {
      // --- יצירת משימה ---
      this.tasksService.addTask(
        currentProjectId,
        formVal.title!,
        formVal.description!,
        rawDate!, 
        formVal.priority! as 'low'|'normal'|'high'
      ).subscribe({
        next: () => this.closeModal(),
        error: (err) => console.error('Create failed', err)
      });
    }
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.item.data as Task;
      const newStatus = event.container.id;
      this.tasksService.updateTask(task.id, { status: newStatus }).subscribe();
    }
  }

  onDeleteTask(task: Task) {
    if(confirm('Are you sure you want to delete this task?')) {
       this.tasksService.deleteTask(task.id).subscribe({
         next: () => { if(this.editingTaskId() === task.id) this.closeModal(); }
       });
    }
  }

  onPriorityChange(task: Task, event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.tasksService.updateTask(task.id, { priority: val }).subscribe();
  }

  onSearch(event: Event) {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  sendComment() {
    if (!this.commentControl.value || !this.selectedTask()) return;
    this.commentsService.addComment(this.selectedTask()!.id, this.commentControl.value!)
      .subscribe(() => this.commentControl.reset());
  }
}