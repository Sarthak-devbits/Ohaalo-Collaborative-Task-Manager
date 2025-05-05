import DashboardCard from "@/components/dashboard/DashboardCard";
import React from "react";
import NewCreationCard from "./NewCreationCard";
import { useQuery } from "@tanstack/react-query";
import { getBoards } from "@/services/webApis/webApis";

const Dashboard = () => {
  const recentViewedParams = {
    workspaceId: 1,
    page: 0,
    limit: 100,
  };

  const {
    data: recentBoards,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["boards", recentViewedParams], // key depends on params to refetch when params change
    queryFn: () => getBoards(recentViewedParams),
    enabled: !!recentViewedParams.workspaceId, // example: only fetch if workspaceId exists
    staleTime: 1000 * 60 * 5, // 5 minutes (optional tuning)
  });


  return (
    <div>
      <div>
        <h1 className="font-medium">Recently Viewed</h1>
        <div className="w-full border p-2 rounded-md border-[#6C43E2] border-dashed mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6].map(() => {
            return <DashboardCard />;
          })}
          <NewCreationCard />
        </div>
      </div>
      <div className="mt-10">
        <h1 className="font-medium">Your Workspace</h1>
        <div className="w-full border px-2 rounded-md border-[#6C43E2] border-dashed  my-3">
          <div className="my-4">
            <div>
              <h3 className="font-light">Telescope 1010</h3>
            </div>
            <div className="w-full border p-2 rounded-md  border-dashed mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4, 5, 6].map(() => {
                return <DashboardCard />;
              })}
              <NewCreationCard />
            </div>
          </div>
          <div className="my-4">
            <div>
              <h3 className="font-light">Telescope 1010</h3>
            </div>
            <div className="w-full border p-2 rounded-md  border-dashed mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4, 5, 6].map(() => {
                return <DashboardCard />;
              })}
              <NewCreationCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
