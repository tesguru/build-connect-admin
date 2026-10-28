import { DataTable } from "@/components/ui/Datatable";
import { Eye, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useMeetings } from "@/libs/hooks/useMeetings";
import DashboardLayout from "../DashboardLayout/DashboardLayout";
import { URLS } from "@/libs/constants/pageurl";

const PLATFORM_COLORS: Record<string, string> = {
  zoom:        "bg-blue-50 text-blue-600",
  google_meet: "bg-green-50 text-green-600",
  teams:       "bg-purple-50 text-purple-600",
};

const STATUS_COLORS: Record<string, string> = {
  scheduled:  "bg-yellow-50 text-yellow-600",
  completed:  "bg-green-50 text-green-600",
  cancelled:  "bg-red-50 text-red-600",
};

const COLUMNS = [
  {
    key: "title",
    header: "Meeting Title",
    render: (row: any) => (
      <span className="text-gray-900 font-medium">{row.title}</span>
    ),
  },
  {
    key: "project",
    header: "Project",
    render: (row: any) => (
      <span className="text-gray-700">{row.project || "N/A"}</span>
    ),
  },
  {
    key: "organizer",
    header: "Organizer",
    render: (row: any) => (
      <div>
        <p className="text-gray-900 font-medium">{row.organizerName}</p>
        <p className="text-gray-500 text-xs">{row.organizerEmail}</p>
      </div>
    ),
  },
  {
    key: "scheduledAt",
    header: "Scheduled At",
    render: (row: any) => (
      <span className="text-gray-700">{row.scheduledAt}</span>
    ),
  },
  {
    key: "duration",
    header: "Duration",
    render: (row: any) => (
      <span className="text-gray-700">{row.duration}</span>
    ),
  },
  {
    key: "platform",
    header: "Platform",
    render: (row: any) => (
      <span className={`px-3 py-1 rounded-md text-sm font-medium ${
        PLATFORM_COLORS[row.platform] || "bg-gray-50 text-gray-600"
      }`}>
        {row.platform?.charAt(0).toUpperCase() + row.platform?.slice(1)}
      </span>
    ),
  },
  {
    key: "meetingType",
    header: "Type",
    render: (row: any) => (
      <span className="text-gray-700">
        {row.meetingType?.replace(/_/g, " ")}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (row: any) => (
      <span className={`px-3 py-1 rounded-md text-sm font-medium ${
        STATUS_COLORS[row.status] || "bg-gray-50 text-gray-600"
      }`}>
        {row.status?.charAt(0).toUpperCase() + row.status?.slice(1)}
      </span>
    ),
  },
];

export default function MeetingsTable() {
  const [page, setPage]   = useState(1);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState('');

  const { getMeetingsQuery } = useMeetings();
  const { data, isLoading, error } = getMeetingsQuery({
    page,
    limit,
    search: search || undefined,
  });
  const rawData    = data?.data?.data     || [];
  const totalCount = data?.data?.meta?.totalDocuments ?? rawData.length;

  const tableData = useMemo(
    () =>
      rawData.map((meeting: any) => ({
        id:             meeting.id,
        title:          meeting.title,
        project:        meeting.project?.title,
        organizerName:  meeting.organizer?.name,
        organizerEmail: meeting.organizer?.email,
        scheduledAt:    meeting.scheduledAt
          ? new Date(meeting.scheduledAt).toLocaleString()
          : "N/A",
        duration:       meeting.durationMinutes
          ? `${meeting.durationMinutes} mins`
          : "N/A",
        platform:       meeting.platform,
        meetingType:    meeting.meetingType,
        status:         meeting.status,
        meetingLink:    meeting.meetingLink,
      })),
    [rawData],
  );

  const actions = useMemo(
    () => [
      {
        label: "View",
        icon: <Eye className="w-4 h-4 text-gray-600" />,
        onClick: (row: any) => {
          if (row.meetingLink) window.open(row.meetingLink, "_blank");
        },
      },
      {
        label: "Delete",
        icon: <Trash2 className="w-4 h-4 text-red-600" />,
        onClick: (row: any) => {
          if (confirm(`Delete meeting: ${row.title}?`)) {
            // deleteMeetingMutation.mutate(row.id)
          }
        },
      },
    ],
    [],
  );

  

  return (
    <div className="max-w-7xl mx-auto">
      <DataTable
        columns={COLUMNS}
        data={tableData}
        actions={actions}
        rowsPerPageOptions={[5, 8, 10, 20]}
        defaultRowsPerPage={limit}
        showSearch={true}
        searchPlaceholder="Search meetings..."
        searchableColumns={["title", "project", "organizerName", "status", "platform"]}
        showSerialNumber={true}
        isLoading={isLoading}
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
 </div>
  );
}