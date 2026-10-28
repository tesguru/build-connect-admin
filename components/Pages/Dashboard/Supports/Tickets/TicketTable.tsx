import { DataTable } from "@/components/ui/Datatable";
import { Eye, Paperclip } from "lucide-react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSupport } from "@/libs/hooks/useSupport";
import { formatStatus } from "@/libs/utils/helpers";

const STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const COLUMNS = [
  {
    key: "ticketNumber",
    header: "Ticket #",
    render: (row: any) => (
      <span className="font-mono text-sm font-semibold text-gray-700">
        {row.ticketNumber}
      </span>
    ),
  },
  {
    key: "subject",
    header: "Subject",
    render: (row: any) => (
      <span className="text-gray-900 font-medium">{row.subject}</span>
    ),
  },
  {
    key: "projectName",
    header: "Project",
    render: (row: any) => (
      <span className="text-gray-700">{row.projectName || "N/A"}</span>
    ),
  },
  {
    key: "priority",
    header: "Priority",
    render: (row: any) => (
      <span
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          row.priority === "high"
            ? "bg-red-50 text-red-600"
            : row.priority === "medium"
            ? "bg-orange-50 text-orange-600"
            : "bg-blue-50 text-blue-600" // low
        }`}
      >
        {formatStatus(row.priority) || "N/A"}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (row: any) => (
      <span
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          row.status === "resolved"
            ? "bg-green-50 text-green-600"
            : row.status === "closed"
            ? "bg-gray-100 text-gray-600"
            : row.status === "in_progress"
            ? "bg-blue-50 text-blue-600"
            : "bg-yellow-50 text-yellow-600" // open
        }`}
      >
        {formatStatus(row.status) || "N/A"}
      </span>
    ),
  },
  {
    key: "attachments",
    header: "Attachments",
    render: (row: any) => (
      <span className="flex items-center gap-1 text-gray-600">
        <Paperclip className="w-3.5 h-3.5" />
        {row.attachmentCount > 0 ? `${row.attachmentCount} file${row.attachmentCount > 1 ? "s" : ""}` : "None"}
      </span>
    ),
  },
  {
    key: "createdAt",
    header: "Created Date",
    render: (row: any) => (
      <span className="text-gray-700">
        {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "N/A"}
      </span>
    ),
  },
];

export default function TicketsTable() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const { getTicketsQuery } = useSupport();
  const { data, isLoading } = getTicketsQuery({
    page,
    limit,
    search: search || undefined,
    status: statusFilter || undefined,
    priority: priorityFilter || undefined,
  });

  const rawData    = data?.data?.data || [];
  const totalCount: number = data?.data?.meta?.totalDocuments ?? rawData.length;

  const tableData = useMemo(
    () =>
      rawData.map((item: any) => ({
        id:              item.id,
        ticketNumber:    item.ticketNumber,
        subject:         item.subject,
        description:     item.description,
        projectName:     item.projectName,
        priority:        item.priority,
        status:          item.status,
        attachmentCount: item.attachments?.length ?? 0,
        attachments:     item.attachments ?? [],
        createdAt:       item.createdAt,
        updatedAt:       item.updatedAt,
      })),
    [rawData],
  );

  const actions = useMemo(
    () => [
      {
        label: "View",
        icon: <Eye className="w-4 h-4 text-gray-600" />,
        onClick: (row: any) => router.push(`/ticket-details/${row.id}`),
      },
    ],
    [router],
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
        searchPlaceholder="Search tickets..."
        searchableColumns={["ticketNumber", "subject", "projectName", "status", "priority"]}
        filters={[
          { key: "status", label: "Status", options: STATUS_OPTIONS },
          { key: "priority", label: "Priority", options: PRIORITY_OPTIONS },
        ]}
        onFilterChange={(values) => {
          setStatusFilter(values.status && values.status !== "all" ? values.status : "");
          setPriorityFilter(values.priority && values.priority !== "all" ? values.priority : "");
          setPage(1);
        }}
        showSerialNumber={true}
        isLoading={isLoading}
        // ── Server-side pagination ──────────────────────────────────────
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