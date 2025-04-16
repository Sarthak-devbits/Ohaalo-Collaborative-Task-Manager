
import React, { useState } from "react";
import { useTaskContext } from "@/contexts/TaskContext";
import { KanbanBoard } from "@/components/board/KanbanBoard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { NewTaskModal } from "@/components/tasks/NewTaskModal";
import { 
  Search,
  Plus,
  Calendar,
  Filter,
  List,
  LayoutGrid,
  MoreHorizontal
} from "lucide-react";
import { Input } from "@/components/ui/input";

export function Workspace() {
  const { currentWorkspace, currentUser, users, isLoading } = useTaskContext();
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  // Get workspace members with full user data
  const members = currentWorkspace?.members
    .map((member) => ({
      ...member,
      user: users.find((user) => user.id === member.userId),
    }))
    .filter((member) => member.user);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Workspace header */}
      <div className="flex h-14 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">{currentWorkspace?.name || "Workspace"}</h1>
          <span className="text-xs text-muted-foreground">
            {currentWorkspace?.description || "No description"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-64 mr-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tasks..."
              className="w-full rounded-md pl-8 text-xs"
            />
          </div>
          <div className="flex -space-x-2 mr-4">
            {members?.slice(0, 3).map((member) => (
              <Avatar key={member.userId} className="h-8 w-8 border-2 border-background">
                <AvatarImage src={member.user?.avatar} />
                <AvatarFallback>{member.user?.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            ))}
            {members && members.length > 3 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                +{members.length - 3}
              </div>
            )}
          </div>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm" onClick={() => setIsNewTaskModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

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
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <LoadingState text="Loading workspace data..." size="lg" />
          </div>
        ) : (
          <KanbanBoard />
        )}
      </div>
      
      {/* New Task Modal */}
      <NewTaskModal 
        isOpen={isNewTaskModalOpen} 
        onClose={() => setIsNewTaskModalOpen(false)} 
      />
    </div>
  );
}
