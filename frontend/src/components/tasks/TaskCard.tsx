
import React, { useState } from "react";
import { Task } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTaskContext } from "@/contexts/TaskContext";
import { getPriorityClass } from "@/data/mockData";
import { Calendar, Check, MessageSquare, Paperclip } from "lucide-react";
import { TaskDetailModal } from "./TaskDetailModal";

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

export function TaskCard({ task, isDragging }: TaskCardProps) {
  const { users } = useTaskContext();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Format the due date to a more readable format
  const formatDueDate = (dateString?: string) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Check if it's today
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }
    
    // Check if it's tomorrow
    if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    }
    
    // Otherwise, return the date in a nice format
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Get completion percentage from subtasks
  const getCompletionPercentage = () => {
    if (!task.subtasks || task.subtasks.length === 0) return 0;
    const completedSubtasks = task.subtasks.filter((subtask) => subtask.completed).length;
    return Math.round((completedSubtasks / task.subtasks.length) * 100);
  };

  // Get assignee data
  const assignees = task.assignees
    .map((id) => users.find((user) => user.id === id))
    .filter(Boolean);

  const handleCardClick = () => {
    // Only open the modal if we're not currently dragging
    if (!isDragging) {
      setIsDetailModalOpen(true);
    }
  };

  return (
    <>
      <div
        className={cn(
          "group relative flex flex-col space-y-2 rounded-md border bg-card p-3 shadow-sm transition-all cursor-pointer",
          isDragging ? "scale-105 opacity-90 shadow-md rotate-1" : "hover:shadow",
          "animate-fade-in"
        )}
        onClick={handleCardClick}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-medium text-sm line-clamp-2">{task.title}</h3>
            {task.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
        </div>

        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="flex items-center gap-1 text-xs px-2 py-0"
              >
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
                <span>{tag.name}</span>
              </Badge>
            ))}
            {task.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">+{task.tags.length - 2}</Badge>
            )}
          </div>
        )}

        {task.subtasks && task.subtasks.length > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{getCompletionPercentage()}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-secondary">
              <div
                className="h-1.5 rounded-full bg-primary transition-all"
                style={{ width: `${getCompletionPercentage()}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-between pt-2">
          <div className="flex items-center gap-2">
            {task.dueDate && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="mr-1 h-3 w-3" />
                <span>{formatDueDate(task.dueDate)}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {task.comments?.length ? (
              <div className="flex items-center text-xs text-muted-foreground">
                <MessageSquare className="mr-1 h-3 w-3" />
                <span>{task.comments.length}</span>
              </div>
            ) : null}
            {task.attachments?.length ? (
              <div className="flex items-center text-xs text-muted-foreground">
                <Paperclip className="mr-1 h-3 w-3" />
                <span>{task.attachments.length}</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex -space-x-2">
            {assignees.slice(0, 3).map((user) => (
              <Avatar key={user!.id} className="h-6 w-6 border-2 border-background">
                <AvatarImage src={user!.avatar} />
                <AvatarFallback className="text-xs">
                  {user!.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
            {assignees.length > 3 && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                +{assignees.length - 3}
              </div>
            )}
          </div>
          <Badge variant="outline" className={cn("text-xs", getPriorityClass(task.priority))}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>
        </div>
      </div>

      <TaskDetailModal 
        task={task} 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
      />
    </>
  );
}
