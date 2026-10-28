import MetricsCard from "@/components/ui/Custom/MetricsCard";
import { SectionLoader } from "@/components/ui/Custom/LoadingState";
import { DataTable } from "@/components/ui/Datatable";
import { useUsers } from "@/libs/hooks/useUsers";

import { FileText, Calendar, Activity as ActivityIcon } from "lucide-react";
import { UserDetailsProps } from "../../UserDetails/UserDetails";
import { useState } from "react";

interface ActivityItem {
  type: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function Activity({ id }: UserDetailsProps) {
  const { activityQuery } = useUsers();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState('');

  const { data, isLoading } = activityQuery(id, {
    page,
    limit,
    search: search || undefined,
  });

  const activitiesData = data?.data?.data || [];
  const totalCount: number = data?.data?.meta?.totalDocuments ?? activitiesData.length;
  const hasActivities = activitiesData.length > 0;

  const recentActivities = activitiesData.map((activity: ActivityItem, index: number) => ({
    id: index, 
    activityTitle: activity.title,
    description: activity.description,
    time: new Date(activity.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    type: activity.type
  }));

  const columns = [
    { 
      key: "activityTitle", 
      header: "Activity Title", 
      render: (row: any) => <span className="font-medium">{row.activityTitle}</span> 
    },
    { 
      key: "description", 
      header: "Description", 
      render: (row: any) => <span className="text-gray-600">{row.description}</span> 
    },
    { 
      key: "time", 
      header: "Time", 
      render: (row: any) => <span className="text-gray-500 text-sm">{row.time}</span> 
    },
  ];

  // Calculate metrics for the activity cards
  const activityMetrics = [
    {
      title: "Total Activities",
      value: activitiesData.length,
      icon: <ActivityIcon className="w-5 h-5 text-blue-600" />,
      className: "bg-white"
    },
    {
      title: "This Month",
      value: activitiesData.filter((activity: ActivityItem) => {
        const activityDate = new Date(activity.createdAt);
        const now = new Date();
        return activityDate.getMonth() === now.getMonth() && 
               activityDate.getFullYear() === now.getFullYear();
      }).length,
      icon: <Calendar className="w-5 h-5 text-green-600" />,
      className: "bg-white"
    },
    {
      title: "Recent",
      value: activitiesData.filter((activity: ActivityItem) => {
        const activityDate = new Date(activity.createdAt);
        const now = new Date();
        const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
        return activityDate >= oneWeekAgo;
      }).length,
      icon: <FileText className="w-5 h-5 text-purple-600" />,
      className: "bg-white"
    }
  ];

  if (isLoading) {
    return (
      <div className="bg-gray-50 p-6">
        <p className="text-2xl font-bold mb-4">Recent Activity</p>
        <SectionLoader label="Loading activity..." />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6">
      <div>
        <p className="text-2xl font-bold mb-4">
          Recent Activity
        </p>
      </div>

      {/* Activity Metrics Cards - Only show if there are activities */}
      {/* {hasActivities && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {activityMetrics.map((metric, index) => (
            <MetricsCard
              key={index}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              className={metric.className}
            />
          ))}
        </div>
      )} */}

      <div className="max-w-7xl mx-auto">
        {hasActivities || search ? (
          <DataTable
            columns={columns}
            data={recentActivities}
            rowsPerPageOptions={[5, 8, 10, 20]}
            defaultRowsPerPage={limit}
            showSearch={true}
            searchPlaceholder="Search activities..."
            searchableColumns={["activityTitle", "description"]}
            showSerialNumber={true}
            isLoading={isLoading}
            emptyMessage="No activities found"
            serverSide={true}
            totalCount={totalCount}
            currentPage={page}
            onPageChange={(newPage) => setPage(newPage)}
            onSearchChange={(term) => {
              setSearch(term);
              setPage(1);
            }}
            onRowsPerPageChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
          />
        ) : (
          // Enhanced empty state
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <ActivityIcon className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Activities Yet
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              This user hasn't performed any activities yet. Activities will appear here when they start using the platform.
            </p>
            <div className="text-sm text-gray-400">
              Activities include: project creation, document uploads, profile updates, etc.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}