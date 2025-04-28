import DashboardCard from "@/components/dashboard/DashboardCard";
import React from "react";
import NewCreationCard from "./NewCreationCard";

const Dashboard = () => {
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
