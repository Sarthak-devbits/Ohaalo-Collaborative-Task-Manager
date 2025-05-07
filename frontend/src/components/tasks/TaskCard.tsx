import React, { useState } from "react";
import { Task } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTaskContext } from "@/contexts/TaskContext";
import { getPriorityClass } from "@/data/mockData";
import { Calendar, Check, MessageSquare, Paperclip } from "lucide-react";
import { TaskDetailModal } from "./TaskDetailModal";
import TaskModal from "../modals/TaskModal";

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

export function TaskCard({ cardData }) {
  const [open, setOpen] = useState(false);
  const { users } = useTaskContext();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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

  return (
    <>
      <TaskModal open={open} handleClose={handleClose}/>
      <div
        className={cn(
          "group relative flex flex-col space-y-2 rounded-md border bg-card p-3 shadow-sm transition-all cursor-pointer",
          false ? "scale-105 opacity-90 shadow-md rotate-1" : "hover:shadow",
          "animate-fade-in"
        )}
        onClick={handleOpen}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-medium text-sm line-clamp-2 capitalize">
              {cardData?.cardTitle}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {cardData?.description}
            </p>
          </div>
        </div>

        <Badge
          variant="outline"
          className="flex items-center gap-1 text-xs px-2 py-0"
        >
          <div
            className="h-2 w-2 rounded-full"
            // style={{ backgroundColor: tag.color }}
          />
          <span>Tag Name</span>
        </Badge>

        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">20%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-secondary">
            <div
              className="h-1.5 rounded-full bg-primary transition-all"
              style={{ width: `80%` }}
            />
          </div>
        </div>

        <div className="flex justify-between pt-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="mr-1 h-3 w-3" />
              <span>Some Date</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-xs text-muted-foreground">
              <MessageSquare className="mr-1 h-3 w-3" />
              <span>Task Comments</span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Paperclip className="mr-1 h-3 w-3" />
              <span>1</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex -space-x-2">
            <Avatar className="h-6 w-6 border-2 border-background">
              {/* <AvatarImage src={user!.avatar} /> */}
              <AvatarFallback className="text-xs">A</AvatarFallback>
            </Avatar>
            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
              +{3}
            </div>
          </div>
          <Badge
            variant="outline"
            // className={cn("text-xs", getPriorityClass(task.priority))}
          >
            priorit
            {/* {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} */}
          </Badge>
        </div>
      </div>

      {/* <TaskDetailModal
        task={task}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      /> */}
    </>
  );
}
