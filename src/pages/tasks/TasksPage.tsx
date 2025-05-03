
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { AuthLayout } from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskService } from "@/services/task-service";
import { Task, TaskStatus } from "@/types/task";
import { Plus, Search } from "lucide-react";

export default function TasksPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        const allTasks = await TaskService.getTasks();
        setTasks(allTasks);
        setFilteredTasks(allTasks);
      } catch (error) {
        console.error('Failed to load tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTasks();
  }, []);

  useEffect(() => {
    // Apply filters whenever tasks, statusFilter, or searchQuery changes
    let result = [...tasks];
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(task => task.status === statusFilter);
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(query) || 
        task.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredTasks(result);
  }, [tasks, statusFilter, searchQuery]);

  return (
    <AuthLayout requireAuth>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
            <Button onClick={() => navigate('/tasks/new')}>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </div>
          
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tasks..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inprogress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {isLoading ? (
            <div className="flex h-48 items-center justify-center rounded-lg border border-dashed bg-muted/40 p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
            </div>
          ) : (
            <TaskList 
              tasks={filteredTasks}
              emptyMessage={
                searchQuery || statusFilter !== "all"
                  ? "No tasks match your filters. Try changing your search or filter criteria."
                  : "No tasks found. Create your first task to get started!"
              }
            />
          )}
        </div>
      </DashboardLayout>
    </AuthLayout>
  );
}
