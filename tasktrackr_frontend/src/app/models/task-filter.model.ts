import type { TaskPriority } from './task.model';

/**
 * PUBLIC_INTERFACE
 * Represents the current filter state for the task list view.
 */
export interface TaskFilter {
  search: string;
  status: 'all' | 'completed' | 'active';
  priority: TaskPriority | 'all';
}
