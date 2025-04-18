import { KanbanBoard } from "@/components/board/KanbanBoard";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { NewTaskModal } from "@/components/tasks/NewTaskModal";
import { Search, Plus, Calendar, List, LayoutGrid } from "lucide-react";

const SingleBoard = () => {
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

      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        <KanbanBoard />
      </div>

      {/* New Task Modal */}
      {/* <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
      /> */}
    </>
  );
};

export default SingleBoard;
