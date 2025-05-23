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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { createCard } from "@/services/webApis/webApis";

const creationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
});

type CreationFormData = z.infer<typeof creationSchema>;

const CreateCard = ({
  title,
  description,
  open = false,
  handleClose,
  listId,
  boardId,
}: {
  title: string;
  description: string;
  open: boolean;
  handleClose: () => void;
  listId: number;
  boardId: number;
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
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreationFormData) =>
      createCard({
        cardTitle: data.title,
        listId: listId,
      }),
    onSuccess: () => {
      toast({ title: "Task created successfully!" });
      queryClient.invalidateQueries({ queryKey: ["list", boardId] });
      reset();
      handleClose();
    },
    onError: (err: any) => {
      toast({
        title: "Failed to create Task",
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

export default CreateCard;
