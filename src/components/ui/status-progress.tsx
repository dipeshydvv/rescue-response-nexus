
import { DisasterReport } from "@/lib/types";
import { Progress } from "@/components/ui/progress";

interface StatusProgressProps {
  status: string;
  className?: string;
}

export function StatusProgress({ status, className }: StatusProgressProps) {
  const getProgress = () => {
    switch (status) {
      case 'pending':
        return 20;
      case 'assigned':
        return 40;
      case 'dispatched':
        return 60;
      case 'in-progress':
        return 80;
      case 'resolved':
        return 100;
      default:
        return 0;
    }
  };

  const getProgressColor = () => {
    if (status === 'pending') return 'bg-status-pending';
    if (status === 'assigned' || status === 'dispatched') return 'bg-status-in-progress';
    if (status === 'in-progress') return 'bg-blue-600';
    if (status === 'resolved') return 'bg-status-completed';
    return 'bg-gray-300';
  };

  return (
    <div className={`w-full space-y-1 ${className}`}>
      <Progress value={getProgress()} className="h-2">
        <div 
          className={`h-full ${getProgressColor()} transition-all duration-500 rounded-full`}
          style={{ width: `${getProgress()}%` }}
        />
      </Progress>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Pending</span>
        <span>Assigned</span>
        <span>In Progress</span>
        <span>Resolved</span>
      </div>
    </div>
  );
}

export default StatusProgress;
