import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import type { Task } from '../../models/task.model';
import type { TaskFilter } from '../../models/task-filter.model';
import { TaskListComponent } from '../../components/task-list/task-list.component';
import { TaskFormComponent } from '../../components/task-form/task-form.component';

/**
 * PUBLIC_INTERFACE
 * DashboardComponent is the main screen of TaskTrackr.
 * It shows filters, the task list, and controls the add/edit modal.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TaskListComponent, TaskFormComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  constructor(private taskService: TaskService) {}

  // Filter state
  filter = signal<TaskFilter>({ search: '', status: 'all', priority: 'all' });

  // Modal state
  showModal = signal<boolean>(false);
  editTask = signal<Task | null>(null);

  // Derived filtered tasks
  filteredTasks = computed(() => {
    const f = this.filter();
    return this.taskService.filterTasks(f);
  });

  // Expose readonly tasks for badges/counts if needed
  get allTasks() {
    return this.taskService.tasks;
  }

  // Actions
  openCreate() {
    this.editTask.set(null);
    this.showModal.set(true);
  }
  openEdit(task: Task) {
    this.editTask.set(task);
    this.showModal.set(true);
  }
  closeModal() {
    this.showModal.set(false);
    this.editTask.set(null);
  }

  onSubmitForm(payload: { title: string; description?: string; dueDate?: string | null }) {
    if (this.editTask()) {
      this.taskService.updateTask(this.editTask()!.id, payload);
    } else {
      this.taskService.createTask(payload);
    }
    this.closeModal();
  }

  onToggleComplete(id: string) {
    this.taskService.toggleComplete(id);
  }

  onDelete(id: string) {
    this.taskService.deleteTask(id);
  }

  onSearchChange(val: string) {
    this.filter.update((f) => ({ ...f, search: val }));
  }
  onStatusChange(val: 'all' | 'completed' | 'active') {
    this.filter.update((f) => ({ ...f, status: val }));
  }
  onPriorityChange(val: 'all' | 'low' | 'medium' | 'high') {
    this.filter.update((f) => ({ ...f, priority: val as any }));
  }
}
