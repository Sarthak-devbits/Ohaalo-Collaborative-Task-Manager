import { TaskProvider } from "@/contexts/TaskContext";
import { Sidebar } from "@/components/navigation/Sidebar";
import { Workspace } from "@/components/workspace/Workspace";

const Index = () => {
  return (
    <TaskProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-hidden">
          <Workspace />
        </div>
      </div>
    </TaskProvider>
  );
};

export default Index;
