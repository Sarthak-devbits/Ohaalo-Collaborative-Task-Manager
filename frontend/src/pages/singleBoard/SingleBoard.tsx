import { KanbanBoard } from "@/components/board/KanbanBoard";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { NewTaskModal } from "@/components/tasks/NewTaskModal";
import { Search, Plus, Calendar, List, LayoutGrid } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getListDetails } from "@/services/webApis/webApis";
import { IList } from "@/interfaces/Ilist";

const SingleBoard = () => {
  const [searchParams] = useSearchParams();
  const boardId = searchParams.get("boardid");
  const navigate = useNavigate();

  useEffect(() => {
    if (!boardId) {
      navigate(-1);
    }
  }, [boardId]);

  const {
    data: boardListData,
    isError,
    isLoading,
  } = useQuery<IList[]>({
    queryKey: ["list", Number(boardId)],
    queryFn: () => getListDetails({ boardId: Number(boardId) }),
  });



  return (
    <>
      {/* Workspace tabs */}
      <div className="flex items-center border-b px-4">
        <Button variant="ghost" className="px-3">
          <LayoutGrid className="mr-2 h-4 w-4" />
          Board
        </Button>
        <Button variant="ghost" className="px-3">
          <List className="mr-2 h-4 w-4" />
          List
        </Button>
        <Button variant="ghost" className="px-3">
          <Calendar className="mr-2 h-4 w-4" />
          Calendar
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        <KanbanBoard boardListData={boardListData} boardId={+boardId}/>
      </div>
    </>
  );
};

export default SingleBoard;
