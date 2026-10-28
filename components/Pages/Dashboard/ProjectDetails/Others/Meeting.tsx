import { DataTable } from "@/components/ui/Datatable";
import { SectionLoader } from "@/components/ui/Custom/LoadingState";
import { Calendar, Clock, Video, Phone, Users, AlertCircle, CheckCircle, PlusIcon } from "lucide-react";
import { useProjects } from "@/libs/hooks/useProjects";
import { useState } from "react";
import ActionButton from "@/components/ui/Button/ActionButton";

export default function Meeting({ project }: any) {
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState('');
  const { getMeetings } = useProjects(); 
  const { data, isLoading } = getMeetings(project.id, {
    page,
    limit,
    search: search || undefined,
  });

  const meetings = data?.data?.data || [];
  const totalCount: number = data?.data?.meta?.totalDocuments ?? meetings.length;

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'Not scheduled';
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  // Get platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'zoom':
        return <Video className="w-5 h-5 text-blue-600" />;
      case 'google_meet':
        return <Video className="w-5 h-5 text-green-600" />;
      case 'teams':
        return <Video className="w-5 h-5 text-purple-600" />;
      case 'phone':
        return <Phone className="w-5 h-5 text-gray-600" />;
      default:
        return <Video className="w-5 h-5 text-gray-600" />;
    }
  };

  // Get meeting type label
  const getMeetingTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'project_kickoff': 'Project Kickoff',
      'progress_review': 'Progress Review',
      'client_meeting': 'Client Meeting',
      'team_meeting': 'Team Meeting',
      'stakeholder_meeting': 'Stakeholder Meeting',
      'planning_session': 'Planning Session'
    };
    return types[type] || type.replace('_', ' ').toUpperCase();
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            <Calendar className="w-3 h-3" />
            Scheduled
          </span>
        );
      case 'in_progress':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
            <Clock className="w-3 h-3" />
            In Progress
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            <CheckCircle className="w-3 h-3" />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
            <AlertCircle className="w-3 h-3" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
            {status}
          </span>
        );
    }
  };

  // Format duration
  const formatDuration = (minutes: number) => {
    if (!minutes) return 'Not set';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  };

  const columns = [
    {
      key: "title",
      header: "Meeting",
      render: (row: any) => (
        <div>
          <div className="font-medium text-gray-900">{row.title}</div>
          <div className="text-sm text-gray-500">{getMeetingTypeLabel(row.meetingType)}</div>
        </div>
      )
    },
    {
      key: "scheduledAt",
      header: "Date & Time",
      render: (row: any) => {
        const formatted = formatDateTime(row.scheduledAt);
        return (
          <div>
            <div className="font-medium">{formatted.date}</div>
            <div className="text-sm text-gray-600">{formatted.time}</div>
          </div>
        );
      }
    },
    {
      key: "duration",
      header: "Duration",
      render: (row: any) => (
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>{formatDuration(row.durationMinutes)}</span>
        </div>
      )
    },
    {
      key: "platform",
      header: "Platform",
      render: (row: any) => (
        <div className="flex items-center gap-2">
          {getPlatformIcon(row.platform)}
          <span className="capitalize">{row.platform?.replace('_', ' ')}</span>
        </div>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (row: any) => getStatusBadge(row.status)
    }
  ];

  const actions = [
    {
      label: "Details",
      icon: <Users className="w-4 h-4 text-gray-600" />,
      onClick: (row: any) => setSelectedMeeting(row)
    },
    {
      label: "Join",
      icon: <Video className="w-4 h-4 text-blue-600" />,
      onClick: (row: any) => {
        if (row.meetingLink) {
          window.open(row.meetingLink, '_blank');
        }
      }
    }
  ];

 
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>
        </div>
        <SectionLoader label="Loading meetings..." />
      </div>
    );
  }

  // Empty state
  if (totalCount === 0 && !search) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>
        </div>
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No meetings scheduled</p>
          <p className="text-sm text-gray-400">Schedule meetings to discuss project progress</p>
        </div>
      </div>
    );
  }

  const MeetingDetailsModal = () => {
    if (!selectedMeeting) return null;
    
    const formattedDateTime = formatDateTime(selectedMeeting.scheduledAt);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{selectedMeeting.title}</h3>
              <button
                onClick={() => setSelectedMeeting(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                <p className="text-gray-700">{selectedMeeting.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Date</h4>
                  <p className="text-gray-700">{formattedDateTime.date}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Time</h4>
                  <p className="text-gray-700">{formattedDateTime.time}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Duration</h4>
                  <p className="text-gray-700">{formatDuration(selectedMeeting.durationMinutes)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Type</h4>
                  <p className="text-gray-700">{getMeetingTypeLabel(selectedMeeting.meetingType)}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Platform</h4>
                <div className="flex items-center gap-2">
                  {getPlatformIcon(selectedMeeting.platform)}
                  <span className="capitalize">{selectedMeeting.platform?.replace('_', ' ')}</span>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
                {getStatusBadge(selectedMeeting.status)}
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedMeeting(null)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
        <div className="flex justify-end mb-3">
       <ActionButton
              label="Schedule Meetings"
              icon={<PlusIcon />}
              href={`/schedule-meeting/${project.id}/${project?.client?.id}`}
            />
            </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {totalCount} meeting{totalCount !== 1 ? 's' : ''}
          </span>
    
        </div>
      </div>

      <DataTable
        columns={columns}
        data={meetings}
        actions={actions}
        showSearch={true}
        searchPlaceholder="Search meetings..."
        searchableColumns={['title', 'meetingType', 'status']}
        showSerialNumber={true}
        isLoading={isLoading}
        emptyMessage="No meetings scheduled"
        rowsPerPageOptions={[5, 8, 10, 20]}
        defaultRowsPerPage={limit}
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

      <MeetingDetailsModal />
    </div>
  );
}