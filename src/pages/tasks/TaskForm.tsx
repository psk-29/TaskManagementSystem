
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { AuthLayout } from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Calendar } from "lucide-react";
import { TaskService } from "@/services/task-service";
import { CreateTaskInput, Task, TaskPriority, TaskStatus, UpdateTaskInput } from "@/types/task";

const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().optional(),
  priority: z.enum(["low", "medium", "high"] as const),
  status: z.enum(["pending", "inprogress", "completed", "canceled"] as const),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

export default function TaskForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!id;
  
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      priority: "medium" as TaskPriority,
      status: "pending" as TaskStatus,
    },
  });

  useEffect(() => {
    const loadTask = async () => {
      if (!isEditMode) return;
      
      try {
        setIsLoading(true);
        const taskData = await TaskService.getTaskById(id);
        setTask(taskData);
        
        form.reset({
          title: taskData.title,
          description: taskData.description,
          dueDate: taskData.dueDate || "",
          priority: taskData.priority,
          status: taskData.status,
        });
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
  }, [id, isEditMode, navigate, toast, form]);

  const onSubmit = async (data: TaskFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (isEditMode && id) {
        const updateData: UpdateTaskInput = {
          id,
          title: data.title,
          description: data.description,
          dueDate: data.dueDate,
          priority: data.priority,
          status: data.status
        };
        await TaskService.updateTask(updateData);
        toast({
          title: "Success",
          description: "Task updated successfully",
        });
      } else {
        const createData: CreateTaskInput = {
          title: data.title,
          description: data.description,
          dueDate: data.dueDate,
          priority: data.priority,
          status: data.status
        };
        await TaskService.createTask(createData);
        toast({
          title: "Success",
          description: "Task created successfully",
        });
      }
      
      navigate('/tasks');
    } catch (error) {
      console.error('Failed to save task:', error);
      toast({
        title: "Error",
        description: `Failed to ${isEditMode ? 'update' : 'create'} task. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout requireAuth>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(isEditMode ? `/tasks/${id}` : '/tasks')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEditMode ? "Edit Task" : "Create New Task"}
            </h1>
          </div>
          
          {isLoading ? (
            <div className="flex h-48 items-center justify-center rounded-lg border border-dashed bg-muted/40 p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4 md:col-span-2">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter task title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter task description"
                              rows={5}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                              type="date" 
                              className="pl-8"
                              {...field}
                              value={field.value || ""}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          When this task should be completed
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="inprogress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="canceled">Canceled</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(isEditMode ? `/tasks/${id}` : '/tasks')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                        {isEditMode ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      isEditMode ? "Update Task" : "Create Task"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </DashboardLayout>
    </AuthLayout>
  );
}
