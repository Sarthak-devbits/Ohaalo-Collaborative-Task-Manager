import { useTaskContext } from "@/contexts/TaskContext";
import { IBoard } from "@/interfaces/Iboards";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ArrowRight } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardCard = ({ board }: { board: IBoard }) => {
  const navigate = useNavigate();
  const { currentWorkspace, users } = useTaskContext();

  const handleNavigateToboard = ( boardId: number) => {
    navigate(`/board?boardid=${boardId}`);
  };

  const members = currentWorkspace?.members
    .map((member) => ({
      ...member,
      user: users.find((user) => user.id === member.userId),
    }))
    .filter((member) => member.user);

  return (
    <div
      className="max-w-[362px] min-h-[144px] w-full rounded-md p-2 py-3 bg-[#EEF7FB] flex flex-col justify-between cursor-pointer"
      onClick={() => handleNavigateToboard(board?.id)}
    >
      <div>
        <h4 className="font-light capitalize">{board?.title}</h4>
        <p className="font-light text-xs text-gray-400 capitalize">
          {board?.description}
        </p>
      </div>
      <div className="flex items-center justify-between text-gray-400">
        <div className="flex -space-x-2 mr-4">
          {members?.slice(0, 3).map((member) => (
            <Avatar
              key={member.userId}
              className="h-8 w-8 border-2 border-background"
            >
              <AvatarImage src={member.user?.avatar} className="rounded-full" />
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
        <ArrowRight />
      </div>
    </div>
  );
};

export default DashboardCard;
