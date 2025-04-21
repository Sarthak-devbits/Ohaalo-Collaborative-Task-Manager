import React, { useEffect, useState } from "react";
import {
  boardsListData as listData,
  useTaskContext,
} from "@/contexts/TaskContext";
import { BoardColumn } from "./BoardColumn";
import { Status } from "@/types";
import { formatStatusTitle } from "@/data/mockData";
import { TaskCard } from "../tasks/TaskCard";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

export function KanbanBoard() {
  const [boardsListData, setBoardsListData] = useState([]);
  const [draggingCardId, setDraggingCardId] = useState<number | null>();
  const [draggingSourceId, setDraggingSourceId] = useState<number | null>();

  useEffect(() => {
    const sortedList = [...listData].sort((a, b) => a.position - b.position);
    setBoardsListData(sortedList);
  }, [listData]);

  // const { board, moveTask } = useTaskContext();

  // const [draggingTask, setDraggingTask] = useState<string | null>(null);
  // const [sourceStatus, setSourceStatus] = useState<Status | null>(null);

  // const handleDragStart = (taskId: string, status: Status) => {
  //   setDraggingTask(taskId);
  //   setSourceStatus(status);
  // };

  // const handleDragOver = (e: React.DragEvent) => {
  //   e.preventDefault();
  // };

  // const handleDrop = (e: React.DragEvent, destinationStatus: Status) => {
  //   e.preventDefault();

  //   console.log(board)
  //   console.log(destinationStatus)

  //   const taskId = e.dataTransfer.getData("taskId");

  //   if (!taskId || !sourceStatus) return;

  //   // Calculate the index where the task should be inserted
  //   // For simplicity, we'll just append to the end of the destination column
  //   const index = board.columns[destinationStatus].taskIds.length;

  //   moveTask(taskId, sourceStatus, destinationStatus, index);

  //   setDraggingTask(null);
  //   setSourceStatus(null);
  // };

  const handleDragStart = (cardId, _sourceId) => {
    setDraggingCardId(cardId);
    setDraggingSourceId(_sourceId);
  };

  const handleDrop = (e: React.DragEvent, destinationId: number) => {
    e.preventDefault();
    const destinationListsCards = boardsListData.find(
      (item) => item?.id == destinationId
    ).cards;
    if (destinationId === draggingSourceId) {
      return;
    }
    if (destinationListsCards.find((item) => item.id == draggingCardId)) {
      return;
    }

    const movedCard = boardsListData
      .find((item) => item.id == draggingSourceId)
      .cards.find((item) => item.id == draggingCardId);

    const updatedList = boardsListData.map((item) => {
      if (item.id === destinationId) {
        return {
          ...item,
          cards: [movedCard, ...item.cards], // immutably add movedCard
        };
      }
      if (item.id === draggingSourceId) {
        return {
          ...item,
          cards: item.cards.filter((card) => card.id !== movedCard.id),
        };
      }
      return item; // return unchanged item
    });

    setBoardsListData(updatedList);
    setDraggingCardId(null);
    setDraggingSourceId(null);
  };
  const getBackgroundColor = (index: number) => {
    const mod = (index + 1) % 6;
    if (mod === 0 || mod === 1) return "bg-[red]/10";
    if (mod === 2) return "bg-accent/10";
    if (mod === 3) return "bg-warning/10";
    if (mod === 4) return "bg-success/10";
    if (mod === 5) return "bg-[black]/10";
    return "bg-muted/30"; // fallback
  };

  return (
    <div className="h-full overflow-auto p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {boardsListData.map((listData, index) => {
          return (
            <div
              key={index}
              className={cn(
                "flex flex-col rounded-md border  ",
                getBackgroundColor(index)
              )}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={(e) => {
                handleDrop(e, listData.id);
              }}
            >
              <div className="flex items-center justify-between border-b px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {listData?.listName}
                  </span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs">
                    {listData?.cards?.length}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  title="Add new task"
                  // onClick={() => setIsNewTaskModalOpen(true)}
                >
                  <Plus size={14} />
                </Button>
              </div>
              <div className="flex-1 overflow-auto p-2 space-y-2">
                {listData.cards.map((cardData, index) => {
                  return (
                    <div
                      draggable
                      key={index}
                      className="min-h-10 w-full"
                      onDragStart={(e) => {
                        handleDragStart(cardData.id, listData.id);
                      }}
                    >
                      <TaskCard cardData={cardData} />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
