export type TaskPriority = 'low' | 'medium' | 'high';

/**
 * PUBLIC_INTERFACE
 * Represents a Task entity within the TaskTrackr application.
 */
export interface Task {
  /** Unique identifier for the task */
  id: string;
  /** Title of the task */
  title: string;
  /** Optional detailed description */
  description?: string;
  /** ISO string due date if any */
  dueDate?: string | null;
  /** Priority of the task */
  priority: TaskPriority;
  /** Completion state */
  completed: boolean;
  /** ISO string created at timestamp */
  createdAt: string;
  /** ISO string updated at timestamp */
  updatedAt: string;
}
