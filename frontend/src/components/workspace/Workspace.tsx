import React, { useEffect, useState } from "react";

import { useTaskContext } from "@/contexts/TaskContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import CreationModal from "../modals/CreationModal";
import FilterSidebar from "../sidebar/FilterSidebar";
import CreateListModal from "../modals/CreateListModal";

export function Workspace() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [openFilterSidebar, setOpenFilterSidebar] = useState(false);
  const { currentWorkspace, currentUser, users, isLoading } = useTaskContext();
  const [navBarTitle, setNavBarTitle] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleFilterSidebarClose = () => {
    setOpenFilterSidebar(false);
  };

  const handleFilterSidebarOpen = () => {
    setOpenFilterSidebar(true);
  };

  // Get workspace members with full user data
  const members = currentWorkspace?.members
    .map((member) => ({
      ...member,
      user: users.find((user) => user.id === member.userId),
    }))
    .filter((member) => member.user);

  useEffect(() => {
    if (location.pathname === "/dashboard") {
      setNavBarTitle("Dashboard");
    } else {
      setNavBarTitle(currentWorkspace?.name);
    }
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden ">
      {openFilterSidebar && (
        <FilterSidebar
          open={openFilterSidebar}
          handleClose={handleFilterSidebarClose}
        />
      )}

      {open && (
        <CreateListModal
          title="Create List"
          description="Organize your tasks into a structured list to improve clarity and focus."
          open={open}
          handleClose={handleClose}
        />
      )}

      {/* Workspace header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b px-4 py-2 ">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">{navBarTitle}</h1>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tasks..."
              className="w-full rounded-md pl-8 text-xs h-8"
            />
          </div>

          {location.pathname !== "/dashboard" && (
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 w-full md:w-auto">
              <div className="flex -space-x-2">
                {members?.slice(0, 3).map((member) => (
                  <Avatar
                    key={member.userId}
                    className="h-8 w-8 border-2 border-background"
                  >
                    <AvatarImage src={member.user?.avatar} />
                    <AvatarFallback>
                      {member.user?.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {members && members.length > 3 && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                    +{members.length - 3}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFilterSidebarOpen}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button size="sm" onClick={handleOpen}>
                  <Plus className="mr-2 h-4 w-4" />
                  New List
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-3 py-4 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
