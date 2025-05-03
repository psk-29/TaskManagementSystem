
import React from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Task, TaskStatus } from "@/types/task";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const navigate = useNavigate();
  
  const priorityColors: Record<string, string> = {
    low: "bg-green-100 text-green-800",
    medium: "bg-blue-100 text-blue-800",
    high: "bg-red-100 text-red-800",
  };

  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-md"
      onClick={() => navigate(`/tasks/${task.id}`)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{task.title}</CardTitle>
          <TaskStatusBadge status={task.status} showIcon={false} />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="line-clamp-2 text-sm text-muted-foreground">{task.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-1">
        <Badge variant="outline" className={cn(priorityColors[task.priority])}>
          {task.priority}
        </Badge>
        {task.dueDate && (
          <span className="text-xs text-muted-foreground">
            Due: {format(new Date(task.dueDate), "MMM d, yyyy")}
          </span>
        )}
      </CardFooter>
    </Card>
  );
}
