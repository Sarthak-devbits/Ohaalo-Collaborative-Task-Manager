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
import { createCard, createWorkspace } from "@/services/webApis/webApis";
import { useSessionVariables } from "@/redux/useSessionVariables";

const creationSchema = z.object({
  name: z.string().min(3, "Workspace name must be at least 3 characters"),
});

type CreationFormData = z.infer<typeof creationSchema>;

const CreateWorkspaceModal = ({
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
  const queryClient = useQueryClient();
  const { userId } = useSessionVariables();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CreationFormData>({
    resolver: zodResolver(creationSchema),
    defaultValues: {
      name: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CreationFormData) =>
      createWorkspace({
        name: data.name,
      }),
    onSuccess: () => {
      toast({ title: "Workspace created successfully!" });
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      reset();
      handleClose();
    },
    onError: (err: any) => {
      toast({
        title: "Failed to create Workspace",
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
              placeholder="Enter workspace name"
              {...register("name")}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
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

export default CreateWorkspaceModal;
