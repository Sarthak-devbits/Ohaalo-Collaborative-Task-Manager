import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTaskContext } from "@/contexts/TaskContext";
import {
  Search,
  Plus,
  LayoutDashboard,
  Calendar,
  Settings,
  Users,
  PanelLeft,
  ChevronDown,
  Inbox,
} from "lucide-react";
import { ohaloSvg } from "@/assets";
import { useLocation, useNavigate } from "react-router-dom";
import CreateWorkspaceModal from "../modals/CreateWorkSpaceModal";
import { useSessionVariables } from "@/redux/useSessionVariables";
import { useQuery } from "@tanstack/react-query";
import { getWorkspaces } from "@/services/webApis/webApis";
import { IWorkspace } from "@/interfaces/IWorkspaceInterface";

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openWorkspace, setOpenWorkspace] = useState(false);
  const { userId } = useSessionVariables();

  const { data: workspaces } = useQuery<IWorkspace[]>({
    queryKey: ["user", userId],
    queryFn: getWorkspaces,
  });

  const handleOpenWorkspace = () => {
    setOpenWorkspace(true);
  };
  const handleCloseWorkspace = () => {
    setOpenWorkspace(false);
  };

  const { currentUser, setCurrentWorkspace, currentWorkspace } =
    useTaskContext();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [workspacesOpen, setWorkspacesOpen] = useState(true);

  const handleNavigationToDashboard = () => {
    navigate("/dashboard");
  };
  const handleNavigationToTask = () => {
    navigate("/task");
  };
  const handleNavigationToCalender = () => {
    navigate("/calender");
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1100) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    // Initial check on mount
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r bg-sidebar transition-all duration-300",
        isCollapsed ? "w-[60px]" : "w-[280px]"
      )}
    >
      {openWorkspace && (
        <CreateWorkspaceModal
          title="Create Workspace"
          description="Start collaborating with a new workspace."
          handleClose={handleCloseWorkspace}
          open={openWorkspace}
        />
      )}

      <div className="flex h-[3.3rem] items-center justify-between border-b px-4 py-2">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <img src={ohaloSvg} />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto h-8 w-8"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <PanelLeft size={18} />
        </Button>
      </div>

      {!isCollapsed && (
        <div className="px-4 py-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-md  pl-8 text-xs"
            />
          </div>
        </div>
      )}

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4 py-4">
          {!isCollapsed && (
            <div className="px-1 py-2">
              <h3 className="flex items-center text-xs font-medium uppercase text-muted-foreground">
                Menu
              </h3>
              <div className="mt-2 space-y-1">
                <Button
                  variant={
                    location.pathname === "/dashboard" ? undefined : "ghost"
                  }
                  size="sm"
                  className={cn("w-full justify-start ")}
                  onClick={handleNavigationToDashboard}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                <Button
                  variant={location.pathname === "/task" ? undefined : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={handleNavigationToTask}
                >
                  <Inbox className="mr-2 h-4 w-4" />
                  My Tasks
                </Button>
                <Button
                  variant={
                    location.pathname === "/calender" ? undefined : "ghost"
                  }
                  size="sm"
                  className="w-full justify-start"
                  onClick={handleNavigationToCalender}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Calendar
                </Button>
              </div>
            </div>
          )}

          {isCollapsed ? (
            <div className="flex flex-col items-center space-y-3 py-2">
              <Button
                variant={
                  location.pathname === "/dashboard" ? undefined : "ghost"
                }
                size="icon"
                className="h-9 w-9"
                onClick={handleNavigationToDashboard}
              >
                <LayoutDashboard size={18} />
              </Button>
              <Button
                variant={location.pathname === "/task" ? undefined : "ghost"}
                size="icon"
                className="h-9 w-9"
                onClick={handleNavigationToTask}
              >
                <Inbox size={18} />
              </Button>
              <Button
                variant={
                  location.pathname === "/calender" ? undefined : "ghost"
                }
                size="icon"
                className="h-9 w-9"
                onClick={handleNavigationToCalender}
              >
                <Calendar size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Users size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Settings size={18} />
              </Button>
            </div>
          ) : (
            <div className="px-1 py-2">
              <div className="flex items-center justify-between">
                <h3
                  className="flex cursor-pointer items-center text-xs font-medium uppercase text-muted-foreground"
                  onClick={() => setWorkspacesOpen(!workspacesOpen)}
                >
                  Workspaces
                  <ChevronDown
                    size={14}
                    className={cn(
                      "ml-1 transition-transform",
                      workspacesOpen ? "rotate-0" : "-rotate-90"
                    )}
                  />
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={handleOpenWorkspace}
                >
                  <Plus size={14} />
                </Button>
              </div>
              {workspacesOpen && (
                <div className="mt-2 space-y-1">
                  {workspaces &&
                    workspaces?.map((workspace) => (
                      <Button
                        key={workspace.id}
                        variant={false ? "secondary" : "ghost"}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => {
                          navigate(`/dashboard?workspaceid=${workspace.id}`);
                        }}
                      >
                        <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-xs font-medium mr-2 capitalize">
                          {workspace.name.substring(0, 1)}
                        </div>
                        <span className="truncate capitalize">
                          {workspace.name}
                        </span>
                      </Button>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex items-center gap-2 border-t p-4">
        {isCollapsed ? (
          <Avatar className="h-8 w-8">
            <AvatarImage src={currentUser?.avatar} />
            <AvatarFallback>
              {currentUser?.name.substring(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ) : (
          <>
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentUser?.avatar} />
              <AvatarFallback>
                {currentUser?.name.substring(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium leading-none">
                {currentUser?.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {currentUser?.email}
              </p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings size={16} />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
