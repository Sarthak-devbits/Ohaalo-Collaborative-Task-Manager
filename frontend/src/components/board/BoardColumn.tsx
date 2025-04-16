
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Button } from "@/components/ui/button";
import { Status, Task } from "@/types";
import { useTaskContext } from "@/contexts/TaskContext";
import { NewTaskModal } from "@/components/tasks/NewTaskModal";
import { Plus } from "lucide-react";

interface BoardColumnProps {
  columnId: Status;
  title: string;
  taskIds: string[];
  onDragStart?: (taskId: string, status: Status) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, status: Status) => void;
}

export function BoardColumn({
  columnId,
  title,
  taskIds,
  onDragStart,
  onDragOver,
  onDrop,
}: BoardColumnProps) {
  const { tasks } = useTaskContext();
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const columnTasks = taskIds.map(taskId => tasks.find(task => task.id === taskId)!).filter(Boolean);

  // Get background color based on status
  const getBackgroundColor = () => {
    switch (columnId) {
      case "backlog":
        return "bg-muted/30";
      case "todo":
        return "bg-muted/30";
      case "in-progress":
        return "bg-accent/10";
      case "review":
        return "bg-warning/10";
      case "done":
        return "bg-success/10";
      default:
        return "bg-muted/30";
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col rounded-md border",
        getBackgroundColor()
      )}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop && onDrop(e, columnId)}
    >
      <div className="flex items-center justify-between border-b px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{title}</span>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs">
            {columnTasks.length}
          </span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7" 
          title="Add new task" 
          onClick={() => setIsNewTaskModalOpen(true)}
        >
          <Plus size={14} />
        </Button>
      </div>
      <div className="flex-1 overflow-auto p-2 space-y-2">
        {columnTasks.length === 0 ? (
          <div className="flex h-20 items-center justify-center rounded-md border border-dashed text-xs text-muted-foreground">
            No tasks
          </div>
        ) : (
          columnTasks.map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("taskId", task.id);
                onDragStart && onDragStart(task.id, columnId);
              }}
            >
              <TaskCard task={task} />
            </div>
          ))
        )}
      </div>
      
      {/* New Task Modal for this column */}
      <NewTaskModal 
        isOpen={isNewTaskModalOpen} 
        onClose={() => setIsNewTaskModalOpen(false)}
        defaultStatus={columnId}
      />
    </div>
  );
}
