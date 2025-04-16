
import React, { createContext, useState, useContext, useEffect } from "react";
import { Task, Workspace, User, Status, Board } from "@/types";
import { mockTasks, mockWorkspaces, mockUsers, getInitialBoardData } from "@/data/mockData";

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
  moveTask: (taskId: string, sourceStatus: Status, destinationStatus: Status, index: number) => void;
};

// Create the context with a default value
const TaskContext = createContext<TaskContextType | null>(null);

// Create the context provider component
export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [workspaces, setWorkspaces] = useState<Workspace[]>(mockWorkspaces);
  const [users] = useState<User[]>(mockUsers);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(mockWorkspaces[0]);
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
        newBoard.columns[oldStatus!].taskIds = newBoard.columns[oldStatus!].taskIds.filter(
          (taskId) => taskId !== id
        );
        
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
                    ? { ...task, ...taskData, updatedAt: new Date().toISOString() }
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
        newBoard.columns[sourceStatus].taskIds = newBoard.columns[sourceStatus].taskIds.filter(
          (id) => id !== taskId
        );
        
        // Add to destination column at the specified index
        const destTaskIds = Array.from(newBoard.columns[destinationStatus].taskIds);
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
