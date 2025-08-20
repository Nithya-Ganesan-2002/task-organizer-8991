import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Task } from '../../models/task.model';

/**
 * PUBLIC_INTERFACE
 * Displays a list of tasks with actions for toggle complete, edit, and delete.
 */
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent {
  @Input() tasks: Task[] = [];
  @Output() toggle = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Task>();
  @Output() remove = new EventEmitter<string>();

  trackById(_index: number, item: Task): string {
    return item.id;
  }

  onToggle(id: string) {
    this.toggle.emit(id);
  }
  onEdit(task: Task) {
    this.edit.emit(task);
  }
  onRemove(id: string) {
    this.remove.emit(id);
  }

  dueLabel(task: Task): string {
    if (!task.dueDate) return '';
    const d = new Date(task.dueDate);
    return d.toLocaleDateString();
  }
}
