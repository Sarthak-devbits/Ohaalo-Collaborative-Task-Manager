
import { User, Task, Workspace, Priority, Status, Tag } from "@/types";

// Mock user data
export const mockUsers: User[] = [
  {
    id: "u1",
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: "https://i.pravatar.cc/150?u=1",
    role: "admin",
  },
  {
    id: "u2",
    name: "Sam Taylor",
    email: "sam@example.com",
    avatar: "https://i.pravatar.cc/150?u=2",
    role: "manager",
  },
  {
    id: "u3",
    name: "Jordan Smith",
    email: "jordan@example.com",
    avatar: "https://i.pravatar.cc/150?u=3",
    role: "member",
  },
  {
    id: "u4",
    name: "Casey Brown",
    email: "casey@example.com",
    avatar: "https://i.pravatar.cc/150?u=4",
    role: "member",
  },
];

// Mock tags data
export const mockTags: Tag[] = [
  { id: "tag1", name: "Bug", color: "#EF4444" },
  { id: "tag2", name: "Feature", color: "#3B82F6" },
  { id: "tag3", name: "Documentation", color: "#8B5CF6" },
  { id: "tag4", name: "Enhancement", color: "#10B981" },
  { id: "tag5", name: "Design", color: "#F59E0B" },
];

// Mock tasks data
export const mockTasks: Task[] = [
  {
    id: "task1",
    title: "Fix login authentication bug",
    description:
      "Users are experiencing issues with the login process. Investigate and fix the authentication flow.",
    status: "todo",
    priority: "high",
    dueDate: "2023-12-15",
    createdAt: "2023-12-01T10:00:00Z",
    updatedAt: "2023-12-01T10:00:00Z",
    createdBy: "u1",
    assignees: ["u2"],
    tags: [mockTags[0]],
    subtasks: [
      { id: "st1", title: "Reproduce issue", completed: true },
      { id: "st2", title: "Debug auth flow", completed: false },
      { id: "st3", title: "Fix and test", completed: false },
    ],
  },
  {
    id: "task2",
    title: "Implement user profile page",
    description:
      "Create a new user profile page that allows users to update their information and settings.",
    status: "in-progress",
    priority: "medium",
    dueDate: "2023-12-20",
    createdAt: "2023-12-02T09:30:00Z",
    updatedAt: "2023-12-03T11:20:00Z",
    createdBy: "u1",
    assignees: ["u3"],
    tags: [mockTags[1], mockTags[4]],
    subtasks: [
      { id: "st4", title: "Design profile layout", completed: true },
      { id: "st5", title: "Implement frontend", completed: true },
      { id: "st6", title: "Connect to API", completed: false },
    ],
  },
  {
    id: "task3",
    title: "Update API documentation",
    description:
      "The API documentation is outdated. Update it to reflect the latest changes in the API.",
    status: "review",
    priority: "low",
    dueDate: "2023-12-10",
    createdAt: "2023-12-01T14:00:00Z",
    updatedAt: "2023-12-04T09:15:00Z",
    createdBy: "u2",
    assignees: ["u4"],
    tags: [mockTags[2]],
    subtasks: [
      { id: "st7", title: "Review current docs", completed: true },
      { id: "st8", title: "Update endpoints", completed: true },
      { id: "st9", title: "Add examples", completed: true },
    ],
  },
  {
    id: "task4",
    title: "Optimize database queries",
    description:
      "Some database queries are slow and causing performance issues. Analyze and optimize them.",
    status: "todo",
    priority: "urgent",
    dueDate: "2023-12-08",
    createdAt: "2023-12-03T11:00:00Z",
    updatedAt: "2023-12-03T11:00:00Z",
    createdBy: "u1",
    assignees: ["u2", "u3"],
    tags: [mockTags[3]],
    subtasks: [
      { id: "st10", title: "Identify slow queries", completed: false },
      { id: "st11", title: "Analyze query plans", completed: false },
      { id: "st12", title: "Implement optimizations", completed: false },
    ],
  },
  {
    id: "task5",
    title: "Design new dashboard UI",
    description:
      "Create a new dashboard UI that provides better insights and improved usability.",
    status: "backlog",
    priority: "medium",
    dueDate: "2023-12-30",
    createdAt: "2023-12-02T15:30:00Z",
    updatedAt: "2023-12-02T15:30:00Z",
    createdBy: "u2",
    assignees: ["u4"],
    tags: [mockTags[4]],
    subtasks: [
      { id: "st13", title: "Research dashboard patterns", completed: false },
      { id: "st14", title: "Create wireframes", completed: false },
      { id: "st15", title: "Design high-fidelity mockups", completed: false },
    ],
  },
  {
    id: "task6",
    title: "Implement email notifications",
    description:
      "Add email notification functionality for task assignments and updates.",
    status: "in-progress",
    priority: "high",
    dueDate: "2023-12-18",
    createdAt: "2023-12-04T09:00:00Z",
    updatedAt: "2023-12-05T11:45:00Z",
    createdBy: "u1",
    assignees: ["u3"],
    tags: [mockTags[1]],
    subtasks: [
      { id: "st16", title: "Set up email service", completed: true },
      { id: "st17", title: "Create email templates", completed: true },
      { id: "st18", title: "Implement triggers", completed: false },
    ],
  },
  {
    id: "task7",
    title: "Update privacy policy",
    description:
      "Update the privacy policy to comply with the latest regulations.",
    status: "done",
    priority: "medium",
    dueDate: "2023-12-05",
    createdAt: "2023-12-01T13:00:00Z",
    updatedAt: "2023-12-05T10:30:00Z",
    createdBy: "u2",
    assignees: ["u1"],
    tags: [mockTags[2]],
    subtasks: [
      { id: "st19", title: "Review current policy", completed: true },
      { id: "st20", title: "Update for compliance", completed: true },
      { id: "st21", title: "Legal review", completed: true },
    ],
  },
  {
    id: "task8",
    title: "Fix mobile responsive issues",
    description:
      "There are some responsive design issues on mobile devices. Identify and fix them.",
    status: "review",
    priority: "high",
    dueDate: "2023-12-12",
    createdAt: "2023-12-03T16:00:00Z",
    updatedAt: "2023-12-06T09:20:00Z",
    createdBy: "u3",
    assignees: ["u4"],
    tags: [mockTags[0], mockTags[4]],
    subtasks: [
      { id: "st22", title: "Identify issues on different devices", completed: true },
      { id: "st23", title: "Fix layout problems", completed: true },
      { id: "st24", title: "Test on multiple devices", completed: false },
    ],
  },
];

// Mock workspace data
export const mockWorkspaces: Workspace[] = [
  {
    id: "w1",
    name: "Product Development",
    description: "Main workspace for product development and feature implementation",
    createdAt: "2023-11-01T10:00:00Z",
    ownerId: "u1",
    members: [
      { userId: "u1", role: "admin" },
      { userId: "u2", role: "manager" },
      { userId: "u3", role: "member" },
      { userId: "u4", role: "member" },
    ],
    tasks: mockTasks.filter((_, index) => index < 5),
  },
  {
    id: "w2",
    name: "Marketing Campaigns",
    description: "Planning and execution of marketing campaigns",
    createdAt: "2023-11-15T14:00:00Z",
    ownerId: "u2",
    members: [
      { userId: "u1", role: "member" },
      { userId: "u2", role: "admin" },
      { userId: "u4", role: "member" },
    ],
    tasks: mockTasks.filter((_, index) => index >= 5),
  },
];

// Generate initial board data from tasks
export const getInitialBoardData = (tasks: Task[]) => {
  const statuses: Status[] = ["backlog", "todo", "in-progress", "review", "done"];
  
  const columns = statuses.reduce((acc, status) => {
    acc[status] = {
      id: status,
      title: formatStatusTitle(status),
      taskIds: tasks.filter(task => task.status === status).map(task => task.id),
    };
    return acc;
  }, {} as Record<Status, { id: Status; title: string; taskIds: string[] }>);

  return {
    columns,
    columnOrder: statuses,
  };
};

// Helper function to format status for display
export const formatStatusTitle = (status: Status): string => {
  switch (status) {
    case "backlog":
      return "Backlog";
    case "todo":
      return "To Do";
    case "in-progress":
      return "In Progress";
    case "review":
      return "Review";
    case "done":
      return "Done";
    default:
      return status;
  }
};

// Helper to get priority classes
export const getPriorityClass = (priority: Priority): string => {
  switch (priority) {
    case "low":
      return "bg-success/10 text-success border-success/20";
    case "medium":
      return "bg-accent/10 text-accent border-accent/20";
    case "high":
      return "bg-warning/10 text-warning border-warning/20";
    case "urgent":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};
