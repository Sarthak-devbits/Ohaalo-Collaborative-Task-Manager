import React, { createContext, useState, useContext, useEffect } from "react";
import { Task, Workspace, User, Status, Board } from "@/types";
import {
  mockTasks,
  mockWorkspaces,
  mockUsers,
  getInitialBoardData,
} from "@/data/mockData";

// Define the context state type
type TaskContextType = {
  tasks: Task[];
  workspaces: Workspace[];
  users: User[];
  currentWorkspace: Workspace | null;
  currentUser: User | null;
  board: Board;
  isLoading: boolean;
  setCurrentWorkspace: (workspace: Workspace) => void;
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (
    taskId: string,
    sourceStatus: Status,
    destinationStatus: Status,
    index: number
  ) => void;
};

// Create the context with a default value
const TaskContext = createContext<TaskContextType | null>(null);

// Create the context provider component
export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [workspaces, setWorkspaces] = useState<Workspace[]>(mockWorkspaces);
  const [users] = useState<User[]>(mockUsers);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    mockWorkspaces[0]
  );
  const [currentUser] = useState<User | null>(mockUsers[0]); // Assume the first user is logged in
  const [board, setBoard] = useState<Board>(getInitialBoardData(tasks));
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data
  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Add a new task
  const addTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const newTask: Task = {
      ...taskData,
      id: `task${tasks.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);

    // Update the board state
    setBoard((prevBoard) => {
      const newBoard = { ...prevBoard };
      newBoard.columns[newTask.status].taskIds.push(newTask.id);
      return newBoard;
    });

    // Update workspace tasks if in a workspace
    if (currentWorkspace) {
      setWorkspaces((prevWorkspaces) =>
        prevWorkspaces.map((workspace) =>
          workspace.id === currentWorkspace.id
            ? {
                ...workspace,
                tasks: [...(workspace.tasks || []), newTask],
              }
            : workspace
        )
      );
    }
  };

  // Update an existing task
  const updateTask = (id: string, taskData: Partial<Task>) => {
    // If status changed, we need to update the board columns
    let oldStatus: Status | null = null;

    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        if (taskData.status && task.status !== taskData.status) {
          oldStatus = task.status;
        }
        return {
          ...task,
          ...taskData,
          updatedAt: new Date().toISOString(),
        };
      }
      return task;
    });

    setTasks(updatedTasks);

    // Update board if status changed
    if (oldStatus && taskData.status) {
      setBoard((prevBoard) => {
        const newBoard = { ...prevBoard };

        // Remove from old column
        newBoard.columns[oldStatus!].taskIds = newBoard.columns[
          oldStatus!
        ].taskIds.filter((taskId) => taskId !== id);

        // Add to new column
        newBoard.columns[taskData.status!].taskIds.push(id);

        return newBoard;
      });
    }

    // Update workspace tasks
    if (currentWorkspace) {
      setWorkspaces((prevWorkspaces) =>
        prevWorkspaces.map((workspace) =>
          workspace.id === currentWorkspace.id
            ? {
                ...workspace,
                tasks: workspace.tasks?.map((task) =>
                  task.id === id
                    ? {
                        ...task,
                        ...taskData,
                        updatedAt: new Date().toISOString(),
                      }
                    : task
                ),
              }
            : workspace
        )
      );
    }
  };

  // Delete a task
  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find((task) => task.id === id);
    if (!taskToDelete) return;

    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));

    // Update board
    setBoard((prevBoard) => {
      const newBoard = { ...prevBoard };
      newBoard.columns[taskToDelete.status].taskIds = newBoard.columns[
        taskToDelete.status
      ].taskIds.filter((taskId) => taskId !== id);
      return newBoard;
    });

    // Update workspace tasks
    if (currentWorkspace) {
      setWorkspaces((prevWorkspaces) =>
        prevWorkspaces.map((workspace) =>
          workspace.id === currentWorkspace.id
            ? {
                ...workspace,
                tasks: workspace.tasks?.filter((task) => task.id !== id),
              }
            : workspace
        )
      );
    }
  };

  // Move a task (drag & drop)
  const moveTask = (
    taskId: string,
    sourceStatus: Status,
    destinationStatus: Status,
    index: number
  ) => {
    // If same column, just reorder
    if (sourceStatus === destinationStatus) {
      setBoard((prevBoard) => {
        const newBoard = { ...prevBoard };
        const column = newBoard.columns[sourceStatus];
        const newTaskIds = Array.from(column.taskIds);

        // Remove the task from its current position
        const taskIndex = newTaskIds.indexOf(taskId);
        newTaskIds.splice(taskIndex, 1);

        // Insert at new position
        newTaskIds.splice(index, 0, taskId);

        newBoard.columns[sourceStatus].taskIds = newTaskIds;
        return newBoard;
      });
    } else {
      // Moving between columns
      setBoard((prevBoard) => {
        const newBoard = { ...prevBoard };

        // Remove from source column
        newBoard.columns[sourceStatus].taskIds = newBoard.columns[
          sourceStatus
        ].taskIds.filter((id) => id !== taskId);

        // Add to destination column at the specified index
        const destTaskIds = Array.from(
          newBoard.columns[destinationStatus].taskIds
        );
        destTaskIds.splice(index, 0, taskId);
        newBoard.columns[destinationStatus].taskIds = destTaskIds;

        return newBoard;
      });

      // Update the task's status
      updateTask(taskId, { status: destinationStatus });
    }
  };

  const value = {
    tasks,
    workspaces,
    users,
    currentWorkspace,
    currentUser,
    board,
    isLoading,
    setCurrentWorkspace,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

// Create a custom hook to use the context
export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};

export const boardsListData = [
  {
    id: 1,
    listName: "Backlog",
    position: 1,
    boardId: 101,
    cards: [
      {
        id: 1,
        cardTitle: "Research competitor products",
        description:
          "Analyze top 5 competitors' features and pricing strategies",
        position: 0,
        priority: "Medium",
        dueDate: "2025-05-10",
        assignee: "Sarah Chen",
      },
      {
        id: 2,
        cardTitle: "Create user personas",
        description:
          "Develop 3-4 detailed user personas based on customer interviews",
        position: 1,
        priority: "High",
        dueDate: "2025-05-12",
        assignee: "Michael Rodriguez",
      },
      {
        id: 3,
        cardTitle: "Define MVP features",
        description: "Outline core features for minimum viable product launch",
        position: 2,
        priority: "High",
        dueDate: "2025-05-15",
        assignee: "Priya Sharma",
      },
      {
        id: 4,
        cardTitle: "Create project roadmap",
        description: "Develop 6-month product roadmap with key milestones",
        position: 3,
        priority: "Medium",
        dueDate: "2025-05-20",
        assignee: "James Wilson",
      },
      {
        id: 5,
        cardTitle: "Set up analytics tracking",
        description: "Implement Google Analytics and custom event tracking",
        position: 4,
        priority: "Low",
        dueDate: "2025-06-01",
        assignee: "Ana Martinez",
      },
      {
        id: 6,
        cardTitle: "Develop content strategy",
        description: "Create editorial calendar and content guidelines",
        position: 5,
        priority: "Medium",
        dueDate: "2025-05-25",
        assignee: "Thomas Lee",
      },
    ],
  },
  {
    id: 2,
    listName: "To Do",
    position: 2,
    boardId: 101,
    cards: [
      {
        id: 7,
        cardTitle: "Design user onboarding flow",
        description: "Create wireframes for new user onboarding experience",
        position: 0,
        priority: "High",
        dueDate: "2025-04-22",
        assignee: "Jessica Park",
      },
      {
        id: 8,
        cardTitle: "Implement login page",
        description: "Build responsive login page with OAuth integration",
        position: 1,
        priority: "High",
        dueDate: "2025-04-23",
        assignee: "David Kim",
      },
      {
        id: 9,
        cardTitle: "Set up CI/CD pipeline",
        description: "Configure automated testing and deployment pipeline",
        position: 2,
        priority: "Medium",
        dueDate: "2025-04-25",
        assignee: "Omar Hassan",
      },
      {
        id: 10,
        cardTitle: "Create API documentation",
        description: "Document RESTful API endpoints using Swagger",
        position: 3,
        priority: "Low",
        dueDate: "2025-04-30",
        assignee: "Sophia Johnson",
      },
      {
        id: 11,
        cardTitle: "Design database schema",
        description: "Create ERD and optimize for performance",
        position: 4,
        priority: "Medium",
        dueDate: "2025-04-24",
        assignee: "Marcus Williams",
      },
      {
        id: 12,
        cardTitle: "Implement password reset functionality",
        description: "Add secure password reset flow with email verification",
        position: 5,
        priority: "Medium",
        dueDate: "2025-04-26",
        assignee: "Leila Ahmadi",
      },
    ],
  },
  {
    id: 3,
    listName: "In Progress",
    position: 3,
    boardId: 101,
    cards: [
      {
        id: 13,
        cardTitle: "Develop dashboard UI",
        description:
          "Create responsive dashboard with data visualization components",
        position: 0,
        priority: "High",
        dueDate: "2025-04-21",
        assignee: "Ryan Taylor",
      },
      {
        id: 14,
        cardTitle: "Implement search functionality",
        description: "Build search with filters and autocomplete",
        position: 1,
        priority: "Medium",
        dueDate: "2025-04-19",
        assignee: "Aisha Mohammed",
      },
      {
        id: 15,
        cardTitle: "Set up user authentication",
        description:
          "Implement JWT authentication and role-based access control",
        position: 2,
        priority: "High",
        dueDate: "2025-04-22",
        assignee: "Carlos Mendez",
      },
      {
        id: 16,
        cardTitle: "Optimize image loading",
        description: "Implement lazy loading and image compression",
        position: 3,
        priority: "Low",
        dueDate: "2025-04-20",
        assignee: "Emma Wilson",
      },
      {
        id: 17,
        cardTitle: "Create notification system",
        description: "Build real-time notification service using WebSockets",
        position: 4,
        priority: "Medium",
        dueDate: "2025-04-23",
        assignee: "Jamal Adams",
      },
      {
        id: 18,
        cardTitle: "Implement drag-and-drop interface",
        description: "Add drag-and-drop functionality for list item reordering",
        position: 5,
        priority: "Medium",
        dueDate: "2025-04-21",
        assignee: "Nina Patel",
      },
    ],
  },
  {
    id: 4,
    listName: "Review",
    position: 3,
    boardId: 101,
    cards: [
      {
        id: 19,
        cardTitle: "Code review: payment integration",
        description: "Review Stripe payment gateway implementation",
        position: 0,
        priority: "High",
        dueDate: "2025-04-19",
        assignee: "Lisa Johnson",
      },
      {
        id: 20,
        cardTitle: "Test user registration flow",
        description: "Verify all registration steps and validation",
        position: 1,
        priority: "Medium",
        dueDate: "2025-04-18",
        assignee: "Daniel Wong",
      },
      {
        id: 21,
        cardTitle: "Review accessibility compliance",
        description: "Ensure WCAG 2.1 AA compliance across all pages",
        position: 2,
        priority: "Medium",
        dueDate: "2025-04-20",
        assignee: "Fatima Al-Zahra",
      },
      {
        id: 22,
        cardTitle: "Performance audit",
        description: "Run Lighthouse audits and address performance issues",
        position: 3,
        priority: "Low",
        dueDate: "2025-04-21",
        assignee: "Jason Miller",
      },
      {
        id: 23,
        cardTitle: "Review mobile responsiveness",
        description: "Test UI on various mobile devices and screen sizes",
        position: 4,
        priority: "High",
        dueDate: "2025-04-19",
        assignee: "Rachel Green",
      },
      {
        id: 24,
        cardTitle: "Security audit",
        description: "Review authentication logic and identify vulnerabilities",
        position: 5,
        priority: "High",
        dueDate: "2025-04-20",
        assignee: "Samuel Jackson",
      },
    ],
  },
  {
    id: 5,
    listName: "Testing",
    position: 4,
    boardId: 101,
    cards: [
      {
        id: 25,
        cardTitle: "Unit tests for authentication module",
        description: "Write comprehensive tests for auth service",
        position: 0,
        priority: "High",
        dueDate: "2025-04-18",
        assignee: "Yuki Tanaka",
      },
      {
        id: 26,
        cardTitle: "Integration tests for API endpoints",
        description: "Create automated tests for all CRUD operations",
        position: 1,
        priority: "Medium",
        dueDate: "2025-04-19",
        assignee: "Lucas Schmidt",
      },
      {
        id: 27,
        cardTitle: "E2E tests for checkout flow",
        description: "Create Cypress tests for complete checkout process",
        position: 2,
        priority: "High",
        dueDate: "2025-04-20",
        assignee: "Olivia Chen",
      },
      {
        id: 28,
        cardTitle: "Performance testing",
        description: "Load test with 1000+ concurrent users",
        position: 3,
        priority: "Medium",
        dueDate: "2025-04-21",
        assignee: "Benjamin Moore",
      },
      {
        id: 29,
        cardTitle: "Cross-browser compatibility testing",
        description: "Test on Chrome, Firefox, Safari, and Edge",
        position: 4,
        priority: "Low",
        dueDate: "2025-04-19",
        assignee: "Zoe Williams",
      },
      {
        id: 30,
        cardTitle: "Regression testing",
        description: "Verify existing features still work after new additions",
        position: 5,
        priority: "Medium",
        dueDate: "2025-04-22",
        assignee: "Hiroshi Yamamoto",
      },
    ],
  },
  {
    id: 6,
    listName: "Done",
    position: 5,
    boardId: 101,
    cards: [
      {
        id: 31,
        cardTitle: "Create project repository",
        description: "Set up Git repository with branching strategy",
        position: 0,
        priority: "High",
        dueDate: "2025-04-10",
        assignee: "Tyler Johnson",
      },
      {
        id: 32,
        cardTitle: "Design system architecture",
        description: "Create architecture diagram and tech stack documentation",
        position: 1,
        priority: "High",
        dueDate: "2025-04-12",
        assignee: "Maria Garcia",
      },
      {
        id: 33,
        cardTitle: "Configure development environment",
        description: "Set up Docker containers for local development",
        position: 2,
        priority: "Medium",
        dueDate: "2025-04-13",
        assignee: "Victor Nguyen",
      },
      {
        id: 34,
        cardTitle: "Create UI component library",
        description:
          "Build reusable UI components with Storybook documentation",
        position: 3,
        priority: "Medium",
        dueDate: "2025-04-15",
        assignee: "Elijah Washington",
      },
      {
        id: 35,
        cardTitle: "Set up error logging",
        description: "Integrate Sentry for frontend and backend error tracking",
        position: 4,
        priority: "Low",
        dueDate: "2025-04-16",
        assignee: "Isabelle Chen",
      },
      {
        id: 36,
        cardTitle: "Create project documentation",
        description: "Set up project wiki with setup instructions",
        position: 5,
        priority: "Medium",
        dueDate: "2025-04-17",
        assignee: "Noah Kim",
      },
    ],
  },
];
