import { DataTable } from "@/components/ui/Datatable";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useDashboard } from "@/libs/hooks/useDashboard";

const MOCK_ACTIVITIES = [
  { id: 1, type: 'Verification', activity: 'Builder verification completed', detail: 'ABC Construction has been verified', status: 'Review', date: '17/01/2025' },
  { id: 2, type: 'Project', activity: 'New project milestone', detail: 'Roofing milestone pending for Villa Grande', status: 'Review', date: '17/01/2025' },
  { id: 3, type: 'Dispute', activity: 'Dispute raised', detail: 'Payment dispute for Project Sunny Heights', status: 'Review', date: '17/01/2025' },
  { id: 4, type: 'Project', activity: 'New project milestone', detail: 'Foundation milestone completed for Villa Grande', status: 'Review', date: '17/01/2025' },
  { id: 5, type: 'Dispute', activity: 'Dispute raised', detail: 'Payment dispute for Project Sunny Heights', status: 'Review', date: '17/01/2025' },
  { id: 6, type: 'Verification', activity: 'Builder verification', detail: 'ABC Construction verification is under review', status: 'Review', date: '17/01/2025' },
  { id: 7, type: 'Bid', activity: 'New bid submitted', detail: 'Express Builders submitted bid for Ocean View', status: 'Review', date: '17/01/2025' },
  { id: 8, type: 'Verification', activity: 'Builder verification completed', detail: 'ABC Construction has been verified', status: 'Review', date: '17/01/2025' },
  { id: 9, type: 'Project', activity: 'New project milestone', detail: 'Electrical work completed for Villa Grande', status: 'Completed', date: '16/01/2025' },
  { id: 10, type: 'Verification', activity: 'Builder verification completed', detail: 'XYZ Builders has been verified', status: 'Completed', date: '16/01/2025' },
  { id: 11, type: 'Project', activity: 'New project milestone', detail: 'Plumbing milestone for Ocean View', status: 'Pending', date: '18/01/2025' },
  { id: 12, type: 'Bid', activity: 'New bid submitted', detail: 'Quality Builders submitted bid for Sunset Plaza', status: 'Pending', date: '18/01/2025' },
  { id: 13, type: 'Verification', activity: 'Builder verification', detail: 'Prime Construction verification pending', status: 'Pending', date: '18/01/2025' },
  { id: 14, type: 'Project', activity: 'New project milestone', detail: 'Painting work for Villa Grande', status: 'Completed', date: '15/01/2025' },
  { id: 15, type: 'Dispute', activity: 'Dispute resolved', detail: 'Payment dispute resolved for Ocean View', status: 'Completed', date: '15/01/2025' },
];

export default function RecentActivity() {
  const [activeTab, setActiveTab] = useState('Review');

  const { getRecentActivity } = useDashboard();
  const { data, isLoading } = getRecentActivity();

  const apiActivities = data?.data?.data || [];

  const allActivities = useMemo(() => {
    if (!Array.isArray(apiActivities) || apiActivities.length === 0) {
      return MOCK_ACTIVITIES;
    }
    return apiActivities.map((item: any, index: number) => ({
      id: item.id ?? index + 1,
      type: item.type ?? '—',
      activity: item.activity ?? item.title ?? '—',
      detail: item.detail ?? item.description ?? '—',
      status: item.status ?? 'Review',
      date: item.date
        ? item.date
        : item.createdAt
        ? new Date(item.createdAt).toLocaleDateString()
        : '—',
    }));
  }, [apiActivities]);


  const tabs = [
    { name: 'All Activities', count: allActivities.length },
    { name: 'Completed', count: allActivities.filter(a => a.status === 'Completed').length },
    { name: 'Review', count: allActivities.filter(a => a.status === 'Review').length },
    { name: 'Pending', count: allActivities.filter(a => a.status === 'Pending').length },
  ];

  const filteredActivities = activeTab === 'All Activities' 
    ? allActivities 
    : allActivities.filter(a => a.status === activeTab);

  // Define table columns
  const columns = [
    {
      key: 'type',
      header: 'Type',
      render: (row) => <span className="text-gray-900">{row.type}</span>
    },
    {
      key: 'activity',
      header: 'Activity',
      render: (row) => <span className="text-gray-900">{row.activity}</span>
    },
    {
      key: 'detail',
      header: 'Details',
      render: (row) => <span className="text-gray-600">{row.detail}</span>
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <span className={`px-3 py-1 rounded-md text-sm font-medium ${
          row.status === 'Completed' 
            ? 'bg-green-100 text-green-700'
            : row.status === 'Pending'
            ? 'bg-red-100 text-red-700'
            : 'bg-blue-100 text-blue-700'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      key: 'date',
      header: 'Date',
      render: (row) => <span className="text-gray-900">{row.date}</span>
    }
  ];

  const actions = [
    {
      label: 'View',
      icon: <Eye className="w-4 h-4 text-gray-600" />,
      onClick: (row) => alert(`Viewing activity: ${row.activity}`)
    },
    {
      label: 'Edit',
      icon: <Edit className="w-4 h-4 text-blue-600" />,
      onClick: (row) => alert(`Editing activity: ${row.activity}`)
    },
    {
      label: 'Delete',
      icon: <Trash2 className="w-4 h-4 text-red-600" />,
      onClick: (row) => {
        if (confirm(`Delete activity: ${row.activity}?`)) {
          alert('Activity deleted!');
        }
      }
    }
  ];

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h1>
        
       

        <DataTable 
          columns={columns}
          data={filteredActivities}
          actions={actions}
          rowsPerPageOptions={[5, 8, 10, 20]}
          defaultRowsPerPage={8}
          showSerialNumber={true}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}