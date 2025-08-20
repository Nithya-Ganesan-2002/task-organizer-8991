import { Injectable, signal } from '@angular/core';
import type { Task, TaskPriority } from '../models/task.model';
import { getLocalStorage, safeUuid } from '../utils/browser-utils';

/**
 * PUBLIC_INTERFACE
 * TaskService provides CRUD operations for tasks using localStorage persistence.
 * It exposes a reactive signal for the task list to allow components to update instantly.
 */
@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly STORAGE_KEY = 'tasktrackr_tasks';
  private readonly tasksSignal = signal<Task[]>(this.loadFromStorage());

  /**
   * PUBLIC_INTERFACE
   * Returns a readonly signal of the tasks list.
   */
  get tasks() {
    /** Expose as readonly; mutation should go via service methods */
    return this.tasksSignal.asReadonly();
  }

  /**
   * PUBLIC_INTERFACE
   * Create a new task and persist it.
   */
  createTask(data: {
    title: string;
    description?: string;
    dueDate?: string | null;
    priority?: TaskPriority;
  }): Task {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: safeUuid(),
      title: data.title.trim(),
      description: data.description?.trim() ?? '',
      dueDate: data.dueDate ?? null,
      priority: data.priority ?? 'medium',
      completed: false,
      createdAt: now,
      updatedAt: now,
    };
    const updated = [newTask, ...this.tasksSignal()];
    this.tasksSignal.set(updated);
    this.saveToStorage(updated);
    return newTask;
  }

  /**
   * PUBLIC_INTERFACE
   * Update an existing task by id.
   */
  updateTask(id: string, patch: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | null {
    let updatedTask: Task | null = null;
    const updated = this.tasksSignal().map((t) => {
      if (t.id !== id) return t;
      updatedTask = {
        ...t,
        ...patch,
        title: patch.title !== undefined ? patch.title.trim() : t.title,
        description: patch.description !== undefined ? patch.description.trim() : t.description,
        updatedAt: new Date().toISOString(),
      };
      return updatedTask;
    });
    this.tasksSignal.set(updated);
    this.saveToStorage(updated);
    return updatedTask;
  }

  /**
   * PUBLIC_INTERFACE
   * Remove a task by id.
   */
  deleteTask(id: string): void {
    const updated = this.tasksSignal().filter((t) => t.id !== id);
    this.tasksSignal.set(updated);
    this.saveToStorage(updated);
  }

  /**
   * PUBLIC_INTERFACE
   * Toggle completion state of a task.
   */
  toggleComplete(id: string): Task | null {
    const task = this.tasksSignal().find((t) => t.id === id);
    if (!task) return null;
    return this.updateTask(id, { completed: !task.completed });
  }

  /**
   * PUBLIC_INTERFACE
   * Filter tasks by search text and additional options.
   */
  filterTasks(options: {
    search?: string;
    status?: 'all' | 'completed' | 'active';
    priority?: TaskPriority | 'all';
  }): Task[] {
    const search = (options.search ?? '').toLowerCase();
    const status = options.status ?? 'all';
    const priority = options.priority ?? 'all';

    return this.tasksSignal().filter((t) => {
      const matchesSearch =
        !search ||
        t.title.toLowerCase().includes(search) ||
        (t.description ?? '').toLowerCase().includes(search);

      const matchesStatus =
        status === 'all' ||
        (status === 'completed' && t.completed) ||
        (status === 'active' && !t.completed);

      const matchesPriority = priority === 'all' || t.priority === priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }

  private saveToStorage(tasks: Task[]) {
    try {
      const ls = getLocalStorage();
      if (ls) {
        ls.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
      }
    } catch {
      // Ignore storage errors to avoid breaking UX
    }
  }

  private loadFromStorage(): Task[] {
    try {
      const ls = getLocalStorage();
      const raw = ls ? ls.getItem(this.STORAGE_KEY) : null;
      if (!raw) return [];
      const parsed = JSON.parse(raw) as Task[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}
