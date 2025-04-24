import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const CreationModal = ({
  title,
  description,
  open = false,
  handleClose,
}: {
  title: string;
  description: string;
  open: boolean;
  handleClose: () => void;
}) => {
  const [value, setValue] = useState("https://ui.shadcn.com/docs/installation");

  const handleValueChange = (e) => {
    e?.preventDefault();
    setValue(e?.target?.value);
  };

  return (
    <div >
      <Dialog open={open} onOpenChange={handleClose}>
     
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Input value={value} onChange={handleValueChange} />
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button type="submit" variant="secondary" >
                Create
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreationModal;
