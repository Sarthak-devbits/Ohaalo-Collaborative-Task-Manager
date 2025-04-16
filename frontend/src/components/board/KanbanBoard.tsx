
import React, { useState } from "react";
import { useTaskContext } from "@/contexts/TaskContext";
import { BoardColumn } from "./BoardColumn";
import { Status } from "@/types";
import { formatStatusTitle } from "@/data/mockData";

export function KanbanBoard() {
  const { board, moveTask } = useTaskContext();
  const [draggingTask, setDraggingTask] = useState<string | null>(null);
  const [sourceStatus, setSourceStatus] = useState<Status | null>(null);

  const handleDragStart = (taskId: string, status: Status) => {
    setDraggingTask(taskId);
    setSourceStatus(status);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, destinationStatus: Status) => {
    e.preventDefault();
    
    const taskId = e.dataTransfer.getData("taskId");
    
    if (!taskId || !sourceStatus) return;
    
    // Calculate the index where the task should be inserted
    // For simplicity, we'll just append to the end of the destination column
    const index = board.columns[destinationStatus].taskIds.length;
    
    moveTask(taskId, sourceStatus, destinationStatus, index);
    
    setDraggingTask(null);
    setSourceStatus(null);
  };

  return (
    <div className="h-full overflow-auto p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {board.columnOrder.map((columnId) => {
          const column = board.columns[columnId];
          return (
            <BoardColumn
              key={columnId}
              columnId={columnId}
              title={formatStatusTitle(columnId)}
              taskIds={column.taskIds}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          );
        })}
      </div>
    </div>
  );
}
