import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { Button } from "../ui/button";
import { BoardColumn } from "./BoardColumn";
import { TaskCard } from "../tasks/TaskCard";
import CreateCard from "../modals/CreateCardModal";
import { moveCardApi } from "@/services/webApis/webApis";
import { IList } from "@/interfaces/Ilist";

export type moveCardData = {
  sourceListId: number;
  destinationListId: number;
  cardId: number;
};

export function KanbanBoard({
  boardListData,
  boardId,
}: {
  boardListData: IList[];
  boardId: number;
}) {
  const [selectedListId, setSelectedListId] = useState<number>(-1);
  const [boardsListData, setBoardsListData] = useState<IList[]>([]);
  const [draggingCardId, setDraggingCardId] = useState<number | null>(null);
  const [draggingSourceId, setDraggingSourceId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    setBoardsListData(boardListData);
  }, [boardListData]);

  const mutation = useMutation({
    mutationFn: (data: moveCardData) => moveCardApi(data),

    onMutate: async (data) => {

      const previousData = [...boardsListData];

      const movedCard = previousData
        .find((item) => item.id === data.sourceListId)
        ?.cards.find((card) => card.id === data.cardId);

      if (!movedCard) return { previousData };

      const updatedList = previousData.map((item) => {
        if (item.id === data.destinationListId) {
          return {
            ...item,
            cards: [movedCard, ...item.cards],
          };
        }
        if (item.id === data.sourceListId) {
          return {
            ...item,
            cards: item.cards.filter((card) => card.id !== movedCard.id),
          };
        }
        return item;
      });

      setBoardsListData(updatedList);
      return { previousData };
    },

    onError: (err:any, _vars, context) => {
      setBoardsListData(context?.previousData || []);
      toast({
        title: "Failed to move Task",
        description: err?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    },

    onSuccess: () => {
      toast({ title: "Task moved successfully!" });
    },

    onSettled: () => {
      // queryClient.invalidateQueries(["boardListData"]);
    },
  });

  const handleDragStart = (cardId: number, sourceId: number) => {
    setDraggingCardId(cardId);
    setDraggingSourceId(sourceId);
  };

  const handleDrop = (e: React.DragEvent, destinationId: number) => {
    e.preventDefault();

    const destinationList = boardsListData.find((item) => item.id === destinationId);
    if (!destinationList) return;

    if (destinationId === draggingSourceId) return;

    const isCardAlreadyThere = destinationList.cards.find((card) => card.id === draggingCardId);
    if (isCardAlreadyThere) return;

    mutation.mutate({
      sourceListId: draggingSourceId!,
      destinationListId: destinationId,
      cardId: draggingCardId!,
    });

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
    return "bg-muted/30";
  };

  return (
    <div className="h-full overflow-auto p-4">
      {open && (
        <CreateCard
          title="Create Task"
          description="Define a new task to keep your team organized and on track."
          open={open}
          handleClose={handleClose}
          listId={selectedListId}
          boardId={boardId}
        />
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {boardsListData?.map((listData, index) => (
          <div
            key={listData.id}
            className={cn("flex flex-col rounded-md border min-h-64", getBackgroundColor(index))}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, listData.id)}
          >
            <div className="flex items-center justify-between border-b px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium capitalize">{listData?.listName}</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs">
                  {listData?.cards?.length}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                title="Add new task"
                onClick={() => {
                  setSelectedListId(listData.id);
                  handleOpen();
                }}
              >
                <Plus size={14} />
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-2 space-y-2">
              {listData.cards.map((cardData) => (
                <div
                  key={cardData.id}
                  draggable
                  className="min-h-10 w-full"
                  onDragStart={() => handleDragStart(cardData.id, listData.id)}
                >
                  <TaskCard cardData={cardData} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
