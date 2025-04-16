
import React, { useState } from "react";
import { Task, Priority, Status, User } from "@/types";
import { useTaskContext } from "@/contexts/TaskContext";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getPriorityClass, formatStatusTitle } from "@/data/mockData";
import {
  Calendar,
  Paperclip,
  Clock,
  MessageSquare,
  Tag,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Edit3,
  Trash2,
  X,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskDetailModal({
  task,
  isOpen,
  onClose,
}: TaskDetailModalProps) {
  const { users, updateTask, deleteTask } = useTaskContext();
  const [editMode, setEditMode] = useState(false);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});

  if (!task) return null;

  const assignees = task.assignees
    .map((id) => users.find((user) => user.id === id))
    .filter(Boolean) as User[];

  const createdBy = users.find((user) => user.id === task.createdBy);

  const handleEdit = () => {
    setEditedTask({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      assignees: [...task.assignees],
      tags: [...task.tags],
      subtasks: task.subtasks ? [...task.subtasks] : [],
    });
    setEditMode(true);
  };

  const handleSave = () => {
    updateTask(task.id, editedTask);
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleDelete = () => {
    deleteTask(task.id);
    onClose();
  };

  const handleSubtaskToggle = (subtaskId: string, completed: boolean) => {
    if (!task.subtasks) return;

    if (editMode) {
      setEditedTask({
        ...editedTask,
        subtasks: editedTask.subtasks?.map((subtask) =>
          subtask.id === subtaskId ? { ...subtask, completed } : subtask
        ),
      });
    } else {
      updateTask(task.id, {
        subtasks: task.subtasks.map((subtask) =>
          subtask.id === subtaskId ? { ...subtask, completed } : subtask
        ),
      });
    }
  };

  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case "urgent":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "high":
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case "medium":
        return <CheckCircle2 className="h-4 w-4 text-accent" />;
      case "low":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      default:
        return null;
    }
  };

  // Formats a date string to a more readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get completion percentage from subtasks
  const getCompletionPercentage = () => {
    if (!task.subtasks || task.subtasks.length === 0) return 0;
    const completedSubtasks = task.subtasks.filter((subtask) => subtask.completed).length;
    return Math.round((completedSubtasks / task.subtasks.length) * 100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-4 flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">
            {editMode ? (
              <Input
                value={editedTask.title}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                className="font-semibold"
              />
            ) : (
              task.title
            )}
          </DialogTitle>
          <div className="flex items-center gap-2">
            {!editMode && (
              <>
                <Button size="sm" variant="outline" onClick={handleEdit}>
                  <Edit3 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </>
            )}
            {editMode && (
              <>
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave}>
                  Save
                </Button>
              </>
            )}
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <Separator />
        <ScrollArea className="max-h-[calc(90vh-8rem)] overflow-auto">
          <div className="grid grid-cols-3 gap-4 p-4">
            {/* Main content - 2/3 width */}
            <div className="col-span-2 space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Description</div>
                {editMode ? (
                  <Textarea
                    value={editedTask.description || ""}
                    onChange={(e) =>
                      setEditedTask({ ...editedTask, description: e.target.value })
                    }
                    placeholder="Add a description..."
                    className="min-h-[100px]"
                  />
                ) : (
                  <div className="rounded-md bg-muted/40 p-3 text-sm">
                    {task.description || "No description provided."}
                  </div>
                )}
              </div>

              {/* Subtasks */}
              {task.subtasks && task.subtasks.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Subtasks</div>
                    <div className="text-xs text-muted-foreground">
                      {getCompletionPercentage()}% Complete
                    </div>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted">
                    <div
                      className="h-1.5 rounded-full bg-primary transition-all"
                      style={{ width: `${getCompletionPercentage()}%` }}
                    />
                  </div>
                  <div className="space-y-2 pt-2">
                    {(editMode ? editedTask.subtasks : task.subtasks)?.map((subtask) => (
                      <div
                        key={subtask.id}
                        className="flex items-center gap-2 rounded-md border p-2"
                      >
                        <Checkbox
                          checked={subtask.completed}
                          onCheckedChange={(checked) =>
                            handleSubtaskToggle(subtask.id, !!checked)
                          }
                        />
                        <span
                          className={cn(
                            "text-sm",
                            subtask.completed && "line-through text-muted-foreground"
                          )}
                        >
                          {subtask.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments section - placeholder */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Comments</div>
                <div className="rounded-md border p-3">
                  <Textarea placeholder="Add a comment..." className="mb-2" />
                  <Button size="sm">Post</Button>
                </div>
                {task.comments && task.comments.length > 0 ? (
                  <div className="space-y-3 pt-2">
                    {task.comments.map((comment) => (
                      <div key={comment.id} className="rounded-md border p-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={users.find((u) => u.id === comment.userId)?.avatar}
                            />
                            <AvatarFallback>
                              {users
                                .find((u) => u.id === comment.userId)
                                ?.name.substring(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">
                            {users.find((u) => u.id === comment.userId)?.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="mt-2 text-sm">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No comments yet.
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - 1/3 width */}
            <div className="space-y-4">
              {/* Status */}
              <div className="space-y-1">
                <div className="text-sm font-medium">Status</div>
                {editMode ? (
                  <div className="flex items-center space-x-2">
                    <select
                      value={editedTask.status}
                      onChange={(e) =>
                        setEditedTask({
                          ...editedTask,
                          status: e.target.value as Status,
                        })
                      }
                      className="w-full rounded-md border p-2 text-sm"
                    >
                      <option value="backlog">Backlog</option>
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-xs capitalize"
                    >
                      {formatStatusTitle(task.status)}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Priority */}
              <div className="space-y-1">
                <div className="text-sm font-medium">Priority</div>
                {editMode ? (
                  <div className="flex items-center space-x-2">
                    <select
                      value={editedTask.priority}
                      onChange={(e) =>
                        setEditedTask({
                          ...editedTask,
                          priority: e.target.value as Priority,
                        })
                      }
                      className="w-full rounded-md border p-2 text-sm"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn("text-xs", getPriorityClass(task.priority))}
                    >
                      {getPriorityIcon(task.priority)}
                      <span className="ml-1 capitalize">{task.priority}</span>
                    </Badge>
                  </div>
                )}
              </div>

              {/* Assignees */}
              <div className="space-y-1">
                <div className="text-sm font-medium">Assignees</div>
                <div className="flex flex-wrap gap-2">
                  {assignees.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-2 rounded-md border px-2 py-1"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {user.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs">{user.name}</span>
                      {editMode && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-4 w-4 p-0"
                          onClick={() =>
                            setEditedTask({
                              ...editedTask,
                              assignees: editedTask.assignees?.filter(
                                (id) => id !== user.id
                              ),
                            })
                          }
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {editMode && (
                    <div className="flex items-center">
                      <Button size="sm" variant="outline">
                        <Plus className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-1">
                <div className="text-sm font-medium">Tags</div>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      className="flex items-center gap-1 text-xs"
                    >
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                      <span>{tag.name}</span>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Due date */}
              <div className="space-y-1">
                <div className="text-sm font-medium">Due Date</div>
                {editMode ? (
                  <Input
                    type="date"
                    value={editedTask.dueDate}
                    onChange={(e) =>
                      setEditedTask({ ...editedTask, dueDate: e.target.value })
                    }
                    className="text-sm"
                  />
                ) : (
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    {task.dueDate ? formatDate(task.dueDate) : "No due date"}
                  </div>
                )}
              </div>

              {/* Created & Updated dates */}
              <div className="space-y-1">
                <div className="text-sm font-medium">Created</div>
                <div className="flex items-center text-sm">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  {formatDate(task.createdAt)} by {createdBy?.name || "Unknown"}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Last Updated</div>
                <div className="flex items-center text-sm">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  {formatDate(task.updatedAt)}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
