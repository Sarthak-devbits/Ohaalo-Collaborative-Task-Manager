import CreationModal from "@/components/modals/CreationModal";
import { useState } from "react";

const NewCreationCard = ({workspaceId}:{workspaceId?:number}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {open && (
        <CreationModal
          title="Create Board"
          description="  Create a new board for real-time collaboration and sharing."
          open={open}
          handleClose={handleClose}
          workspaceId={workspaceId}
        />
      )}
      <div
        className="max-w-[362px] min-h-[144px] w-full rounded-md p-2 py-3 border border-gray-300 border-dashed flex flex-col  cursor-pointer justify-center items-center"
        onClick={handleOpen}
      >
        <h3 className="font-light">New Board</h3>
      </div>
    </>
  );
};

export default NewCreationCard;
