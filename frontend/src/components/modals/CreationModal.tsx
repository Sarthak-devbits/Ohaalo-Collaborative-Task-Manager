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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { createBoard, getWorkspaces } from "@/services/webApis/webApis";
import { useSessionVariables } from "@/redux/useSessionVariables";
import { IWorkspace } from "@/interfaces/IWorkspaceInterface";

// Update schema to include workspaceId
const creationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  visibility: z.enum(["PUBLIC", "PRIVATE"], {
    required_error: "Please select visibility",
  }),
  workspaceId: z.coerce.number({
    required_error: "Please select a workspace",
    invalid_type_error: "Workspace must be selected",
  }),
});

type CreationFormData = z.infer<typeof creationSchema>;

const CreationModal = ({
  title,
  description,
  open = false,
  handleClose,
  workspaceId,
}: {
  title: string;
  description: string;
  open: boolean;
  handleClose: () => void;
  workspaceId?: number;
}) => {
  const queryClient = useQueryClient();
  const { userId } = useSessionVariables();

  const { data: workspaces } = useQuery<IWorkspace[]>({
    queryKey: ["user", userId],
    queryFn: getWorkspaces,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<CreationFormData>({
    resolver: zodResolver(creationSchema),
    defaultValues: {
      title: "",
      visibility: "PUBLIC",
      workspaceId: workspaceId ?? undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CreationFormData) =>
      createBoard({
        title: data.title,
        visibility: data.visibility,
        backgroundImg:
          "https://dev.to/docker/setting-up-aws-s3-bucket-locally-using-localstack-and-docker-l6b",
        workspaceId: data.workspaceId,
      }),
    onSuccess: () => {
      toast({ title: "Board created successfully!" });
      queryClient.invalidateQueries({ queryKey: ["recentboards"] });
      queryClient.invalidateQueries({ queryKey: ["detailed-workspace"] });
      reset();
      handleClose();
    },
    onError: (err: any) => {
      toast({
        title: "Failed to create board",
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

          {/* Title input */}
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

          {/* Workspace select */}

          <div className="grid gap-2">
            <Select
              value={watch("workspaceId")?.toString()} // keeps the UI in sync with form state
              onValueChange={(value) => setValue("workspaceId", Number(value))}
              disabled={!!workspaceId}
            >
              <SelectTrigger className="capitalize">
                <SelectValue placeholder="Select workspace" />
              </SelectTrigger>
              <SelectContent>
                {workspaces?.map((workspace) => (
                  <SelectItem
                    key={workspace.id}
                    value={workspace.id.toString()}
                    className="capitalize"
                    disabled={workspaceId ? true : false}
                  >
                    {workspace.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.workspaceId && (
              <p className="text-sm text-red-600">
                {errors.workspaceId.message}
              </p>
            )}
          </div>

          {/* Visibility select */}
          <div className="grid gap-2">
            <Select
              onValueChange={(value) =>
                setValue("visibility", value as "PUBLIC" | "PRIVATE")
              }
              defaultValue="PUBLIC"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLIC">Public</SelectItem>
                <SelectItem value="PRIVATE">Private</SelectItem>
              </SelectContent>
            </Select>
            {errors.visibility && (
              <p className="text-sm text-red-600">
                {errors.visibility.message}
              </p>
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

export default CreationModal;
