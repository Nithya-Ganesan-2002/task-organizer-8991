import { Component, EventEmitter, Input, Output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Task, TaskPriority } from '../../models/task.model';

/**
 * PUBLIC_INTERFACE
 * TaskFormComponent presents a minimal form to create or edit a task.
 * Emits submit and cancel events to the parent.
 */
@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
})
export class TaskFormComponent {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() task: Task | null = null;

  @Output() submitForm = new EventEmitter<{
    title: string;
    description?: string;
    dueDate?: string | null;
    priority?: TaskPriority;
  }>();
  @Output() cancel = new EventEmitter<void>();

  title = signal<string>('');
  description = signal<string>('');
  dueDate = signal<string | null>(null);
  priority = signal<TaskPriority>('medium');

  constructor() {
    // Sync initial values when task input changes
    effect(() => {
      const t = this.task;
      if (t) {
        this.title.set(t.title);
        this.description.set(t.description ?? '');
        this.dueDate.set(t.dueDate ?? null);
        this.priority.set(t.priority);
      } else {
        this.reset();
      }
    });
  }

  onSubmit() {
    const titleVal = this.title().trim();
    if (!titleVal) return;
    this.submitForm.emit({
      title: titleVal,
      description: this.description().trim(),
      dueDate: this.dueDate(),
      priority: this.priority(),
    });
  }

  onCancel() {
    this.cancel.emit();
  }

  reset() {
    this.title.set('');
    this.description.set('');
    this.dueDate.set(null);
    this.priority.set('medium');
  }
}
