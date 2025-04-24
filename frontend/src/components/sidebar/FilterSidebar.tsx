import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ReactNode } from "react";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";

const FilterContainer = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <>
      <div className="flex flex-col gap-2 ">
        <div className="text-gray-500 font-medium">{title}</div>
        <div>{children}</div>
      </div>
    </>
  );
};

const FilterSidebar = ({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) => {
  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="font-normal text-primary">Filters</SheetTitle>
        </SheetHeader>
        <div className="mt-10 flex flex-col gap-10">
          <FilterContainer title="DUE DATE">
            <div className="flex flex-col gap-4">
              {[
                "No Date",
                "Overdue",
                "Upcoming",
                "Marked As Completed",
                "Not Marked As Completed",
              ].map((item) => {
                return (
                  <div className="flex items-center gap-3" key={item}>
                    <Checkbox id={item} />
                    <div className="font-normal">{item}</div>
                  </div>
                );
              })}
            </div>
          </FilterContainer>
          <FilterContainer title="MEMBERS">
            <div className="flex flex-col gap-4">
              {["No Member", "Select All"].map((item) => {
                return (
                  <div className="flex items-center gap-3" key={item}>
                    <Checkbox id={item} />
                    <div className="font-normal">{item}</div>
                  </div>
                );
              })}
              {/* dropdown is missing */}
            </div>
          </FilterContainer>
          <FilterContainer title="MEMBERS">
            <div className="flex flex-col gap-4">
              {[
                { title: "Priority 1", color: "#F8BD1C" },
                { title: "", color: "#14AE5C" },
                { title: "", color: "#E26043" },
                { title: "Info", color: "#1CC3F8" },
              ].map((item, index) => {
                return (
                  <div className="flex items-center gap-3" key={index}>
                    <Checkbox id={index.toString()} />
                    <div
                      className={cn("font-normal h-[31px] w-full flex items-center")}
                      style={{ backgroundColor: item.color }}
                    >
                      <div className="font-light text-sm pl-2">{item.title}</div>
                    </div>
                  </div>
                );
              })}
              {/* dropdown is missing */}
            </div>
          </FilterContainer>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterSidebar;
