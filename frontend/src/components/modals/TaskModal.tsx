import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Archive, Move, Share } from "lucide-react";

interface TaskModalProps {
  open: boolean;
  handleClose: () => void;
}

const TaskModal = ({ open, handleClose }: TaskModalProps) => {
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-7xl h-full md:max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Checkbox id="task-checkbox" />
            <DialogTitle className="font-light text-xl text-gray-700">
              Old fashioned recipe for preventing allergies
            </DialogTitle>
          </div>
          <div className="flex items-center gap-2 font-light text-md text-black">
            <p>in list</p>
            <h6 className="font-semibold text-primary">Design</h6>
          </div>
        </DialogHeader>

        <div className="max-h-[700px] md:max-h-full overflow-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-5">
            {/* Left Column */}
            <div className="md:col-span-3 p-4 flex flex-col gap-6">
              {/* Description */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="description" className="text-base font-light">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Add description..."
                  className="min-h-[120px] bg-[#6C43E21A] font-light"
                />
              </div>

              {/* Comments */}
              <div className="flex flex-col gap-4">
                <Label htmlFor="comments" className="text-base font-light">
                  Comments
                </Label>

                {/* Add Comment */}
                <div className="flex gap-2 items-start">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/your-avatar.png" />
                    <AvatarFallback>YO</AvatarFallback>
                  </Avatar>
                  <Textarea
                    id="comments"
                    placeholder="Write a comment..."
                    className="min-h-[30px] flex-1 bg-[#6C43E21A] font-light"
                  />
                </div>

                {/* Mock Comment */}
                <div className="flex gap-3 items-start">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/user-avatar.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-muted rounded-lg px-3 py-2">
                    <p className="text-sm text-gray-800">
                      This is a great start, but maybe we can clarify the
                      timeline a bit more?
                    </p>
                    <div className="flex gap-4 mt-1">
                      <span className="text-xs text-muted-foreground">
                        — John Doe, 2h ago
                      </span>
                      <div className="flex gap-2">
                        <span className="text-xs text-[#BF6A02] cursor-pointer">
                          Edit
                        </span>
                        <span className="text-xs text-[#BF6A02] cursor-pointer">
                          Delete
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="md:col-span-2 flex flex-col gap-2">
              <div className="border dotted-purple-border flex flex-col">
                <div className="h-[40px] p-2 border-t-0 border-l-0 border-r-0 border dotted-purple-border">
                  <h4 className="font-normal text-base text-gray-500">
                    DETAILS
                  </h4>
                </div>

                <div className="flex flex-col gap-10 my-10 px-3">
                  {[
                    { label: "Due Date" },
                    { label: "Member" },
                    { label: "Attachments" },
                    { label: "Labels" },
                    { label: "Reporter" },
                  ].map(({ label }) => (
                    <div key={label} className="grid grid-cols-5">
                      <div className="col-span-2">
                        <h4 className="font-normal text-base">{label}</h4>
                      </div>
                      <div className="col-span-3 text-gray-500 cursor-pointer">
                        + Add
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border dotted-purple-border p-2">
                <h4 className="font-normal text-base text-gray-500">ACTIONS</h4>
                <div className="flex flex-col gap-2 pt-4">
                  <Button className="bg-[#F5F5F5] text-primary">
                    <Share />
                    Share
                  </Button>
                  <Button className="bg-[#F5F5F5] text-primary">
                    <Move /> Move
                  </Button>
                  <Button>
                    {" "}
                    <Archive />
                    Archive
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
