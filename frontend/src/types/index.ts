
// Task priority levels
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

// Task status types
export type Status = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';

// User role types
export type UserRole = 'admin' | 'manager' | 'member' | 'guest';

// Base user interface
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
}

// Task attachment interface
export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
}

// Task comment interface
export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  user?: User;
  taskId: string;
}

// Task tag interface
export interface Tag {
  id: string;
  name: string;
  color: string;
}

// Task interface
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  assignees: string[];
  tags: Tag[];
  attachments?: Attachment[];
  comments?: Comment[];
  subtasks?: { id: string; title: string; completed: boolean }[];
}

// Workspace/project interface
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  ownerId: string;
  members: { userId: string; role: UserRole }[];
  tasks?: Task[];
}

// Column interface for kanban board
export interface Column {
  id: Status;
  title: string;
  taskIds: string[];
}

// Board interface
export interface Board {
  columns: Record<Status, Column>;
  columnOrder: Status[];
}
