
import React from "react";
import { Badge } from "@/components/ui/badge";
import { TaskStatus } from "@/types/task";
import { CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskStatusBadgeProps {
  status: TaskStatus;
  showIcon?: boolean;
  className?: string;
}

export function TaskStatusBadge({ status, showIcon = true, className }: TaskStatusBadgeProps) {
  const statusColors: Record<TaskStatus, string> = {
    pending: "bg-status-pending text-white",
    inprogress: "bg-status-inprogress text-white",
    completed: "bg-status-completed text-white",
    canceled: "bg-status-canceled text-white",
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'inprogress':
        return <Clock className="h-4 w-4" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      case 'canceled':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case 'inprogress':
        return 'In Progress';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <Badge className={cn(statusColors[status], "flex items-center gap-1", className)}>
      {showIcon && getStatusIcon(status)}
      <span>{getStatusLabel(status)}</span>
    </Badge>
  );
}
