
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { AuthLayout } from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskStatusBadge } from "@/components/tasks/TaskStatusBadge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { TaskService } from "@/services/task-service";
import { Task, TaskStatus } from "@/types/task";
import { Edit, Trash2, ArrowLeft, Calendar, CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const loadTask = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const taskData = await TaskService.getTaskById(id);
        setTask(taskData);
      } catch (error) {
        console.error('Failed to load task:', error);
        toast({
          title: "Error",
          description: "Failed to load task details. Please try again.",
          variant: "destructive",
        });
        navigate('/tasks');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTask();
  }, [id, navigate, toast]);

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      setIsDeleting(true);
      await TaskService.deleteTask(id);
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
      navigate('/tasks');
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-status-completed" />;
      case 'inprogress':
        return <Clock className="h-5 w-5 text-status-inprogress" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-status-pending" />;
      case 'canceled':
        return <XCircle className="h-5 w-5 text-status-canceled" />;
      default:
        return null;
    }
  };

  const statusColors: Record<TaskStatus, string> = {
    pending: "bg-status-pending text-white",
    inprogress: "bg-status-inprogress text-white",
    completed: "bg-status-completed text-white",
    canceled: "bg-status-canceled text-white",
  };

  const priorityColors: Record<string, string> = {
    low: "bg-green-100 text-green-800",
    medium: "bg-blue-100 text-blue-800",
    high: "bg-red-100 text-red-800",
  };

  if (isLoading) {
    return (
      <AuthLayout requireAuth>
        <DashboardLayout>
          <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          </div>
        </DashboardLayout>
      </AuthLayout>
    );
  }

  if (!task) {
    return (
      <AuthLayout requireAuth>
        <DashboardLayout>
          <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center gap-4">
            <h2 className="text-xl font-semibold">Task not found</h2>
            <Button onClick={() => navigate('/tasks')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tasks
            </Button>
          </div>
        </DashboardLayout>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout requireAuth>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/tasks')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Task Details</h1>
          </div>
          
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div>
                <CardTitle className="text-2xl">{task.title}</CardTitle>
                {task.dueDate && (
                  <CardDescription className="mt-1 flex items-center text-sm">
                    <Calendar className="mr-1 h-4 w-4" />
                    Due: {format(new Date(task.dueDate), "PPP")}
                  </CardDescription>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate(`/tasks/${task.id}/edit`)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Task</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this task? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                        Cancel
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={handleDelete}
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <>
                            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                            Deleting...
                          </>
                        ) : (
                          "Delete"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4 pt-4">
              <div className="flex flex-wrap gap-3">
                <TaskStatusBadge status={task.status} className="text-sm" />
                <Badge variant="outline" className={cn(priorityColors[task.priority], "text-sm")}>
                  Priority: {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Badge>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="mb-2 font-medium">Description</h3>
                <p className="whitespace-pre-line text-muted-foreground">{task.description}</p>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between pt-3 text-xs text-muted-foreground">
              <span>Created: {format(new Date(task.createdAt), "PPP")}</span>
              <span>Last updated: {format(new Date(task.updatedAt), "PPP")}</span>
            </CardFooter>
          </Card>
        </div>
      </DashboardLayout>
    </AuthLayout>
  );
}
