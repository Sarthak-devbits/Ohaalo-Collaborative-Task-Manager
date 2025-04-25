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
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { createList } from "@/services/webApis/webApis";

const creationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  boardId: z.number().min(1, "List is missing"),
});

type CreationFormData = z.infer<typeof creationSchema>;

const CreateListModal = ({
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
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CreationFormData>({
    resolver: zodResolver(creationSchema),
    defaultValues: {
      title: "",
      boardId: 5,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CreationFormData) =>
      createList({
        listName: data.title,
        boardId: data.boardId,
      }),
    onSuccess: () => {
      toast({ title: "List created successfully!" });
      reset();
      handleClose();
    },
    onError: (err: any) => {
      toast({
        title: "Failed to create List",
        description: err?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreationFormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-2">
            <Input
              placeholder="Enter a title"
              {...register("title")}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <DialogFooter className="sm:justify-end">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateListModal;
