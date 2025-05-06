import DashboardCard from "@/components/dashboard/DashboardCard";
import React, { useEffect } from "react";
import NewCreationCard from "./NewCreationCard";
import { useQuery } from "@tanstack/react-query";
import {
  getBoards,
  recentlyViewedBoards,
  workspaceDetailedData,
} from "@/services/webApis/webApis";
import { IBoard } from "@/interfaces/Iboards";
import { IWorkspaceDetailed } from "@/interfaces/IWorkspaceInterface";
import { useSearchParams } from "react-router-dom";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceid");

  const { data: recentBoards = [] } = useQuery<IBoard[]>({
    queryKey: ["recentboards"], // key depends on params to refetch when params change
    queryFn: () => recentlyViewedBoards(),
    staleTime: 1000 * 60 * 5, // 5 minutes (optional tuning)
  });

  const { data: workspaces = [] } = useQuery<IWorkspaceDetailed[]>({
    queryKey: ["detailed-workspace"],
    queryFn: () => workspaceDetailedData(),
  });

  useEffect(() => {
    if (workspaceId) {
      const element = document.getElementById(`workspace-${workspaceId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      const element = document.getElementById(`main-container`);
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, [workspaceId]);

  return (
    <div id="main-container">
      <div>
        <h1 className="font-medium">Recently Viewed</h1>
        <div className="w-full border p-2 rounded-md border-[#6C43E2] border-dashed mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {recentBoards.map((board, index) => {
            return (
              <div key={index}>
                <DashboardCard board={board} />
              </div>
            );
          })}
          <NewCreationCard />
        </div>
      </div>
      <div className="mt-10">
        <h1 className="font-medium">Your Workspace</h1>
        <div className="w-full border px-2 rounded-md border-[#6C43E2] border-dashed  my-3">
          {workspaces?.map((workspace, index) => {
            return (
              <div
                className="my-4"
                key={index}
                id={`workspace-${workspace.id}`}
              >
                <div>
                  <h3 className="font-light capitalize">{workspace?.name}</h3>
                </div>
                <div className="w-full border p-2 rounded-md  border-dashed mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {workspace?.boards.map((board, index) => {
                    return (
                      <div key={index}>
                        <DashboardCard board={board} />
                      </div>
                    );
                  })}
                  <NewCreationCard workspaceId={workspace.id} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
