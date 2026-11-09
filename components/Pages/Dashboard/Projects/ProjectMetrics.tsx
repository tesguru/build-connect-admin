import MetricsCard from "@/components/ui/Custom/MetricsCard";
import { Building2, AlertCircle, AlertTriangle } from "lucide-react";




export default function ProjectMetrics({stats} :any) {
  const metrics = [
  {
    icon: Building2,
    label: 'Active Projects',
    value: stats?.activeProjects ?? 0,
   
  },
  {
    icon: AlertCircle,
    label: 'Total Milestone',
    value: stats?.totalMilestones ?? 0,
   
  },
  {
    icon: AlertTriangle,
    label: 'Pending Approval',
    value: stats?.pendingApprovals ?? 0,
  
  },
  {
    icon: AlertTriangle,
    label: 'Completed Project',
    value: stats?.completedProjects ?? 0,
   
  }
];
  return <MetricsCard metrics={metrics} />;
}
