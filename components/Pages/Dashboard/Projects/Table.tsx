import { DataTable } from "@/components/ui/Datatable";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProjects } from "@/libs/hooks/useProjects";
import ProjectMetrics from "./ProjectMetrics";
import { useState, useMemo } from "react";

const COLUMNS = [
  {
    key: "title",
    header: "Project",
    render: (row: any) => <span className="font-medium">{row.title}</span>,
  },
  {
    key: "client",
    header: "Client",
    render: (row: any) => <span>{row.client?.name || "N/A"}</span>,
  },
  {
    key: "builder",
    header: "Builder",
    render: () => <span>Abc Construction</span>,
  },
  {
    key: "status",
    header: "Status",
    render: (row: any) => (
      <span
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          row.status === "active"
            ? "bg-green-100 text-green-700"
            : row.status === "bidding"
            ? "bg-blue-100 text-blue-700"
            : row.status === "draft"
            ? "bg-gray-100 text-gray-700"
            : row.status === "completed"
            ? "bg-purple-100 text-purple-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {row.status?.charAt(0).toUpperCase() + row.status?.slice(1)}
      </span>
    ),
  },
  {
    key: "budget",
    header: "Budget",
    render: (row: any) => (
      <span>{row.budgetRange || `Range ${row.budgetRangeId}`}</span>
    ),
  },
  {
    key: "startDate",
    header: "Start Date",
    render: (row: any) => (
      <span>
        {row.startDate
          ? new Date(row.startDate).toLocaleDateString()
          : "Not set"}
      </span>
    ),
  },
  {
    key: "progress",
    header: "Progress",
    render: (row: any) => (
      <div className="flex items-center gap-2">
        <div className="w-16 bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${row.progress || 0}%` }}
          />
        </div>
        <span className="text-sm text-gray-600">{row.progress || 0}%</span>
      </div>
    ),
  },
];

export default function ProjectTable() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState('');

  const { projectsQuery } = useProjects();
  const { data, isLoading } = projectsQuery({
    page,
    limit,
    search: search || undefined,
  });

  const projects = data?.data?.data?.items || [];
  const stats = data?.data?.data?.stats || [];
  const totalCount: number = data?.data?.data?.meta?.totalDocuments ?? projects.length;

  const actions = useMemo(
    () => [
      {
        label: "View",
        icon: <Eye className="w-4 h-4 text-gray-600" />,
        onClick: (row: any) => router.push(`/project-details/${row.id}`),
      },
    ],
    [router],
  );

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div>
        <ProjectMetrics stats={stats} />
      </div>
      <div className="max-w-7xl mx-auto">
        <DataTable
          columns={COLUMNS}
          data={projects}
          actions={actions}
          rowsPerPageOptions={[5, 8, 10, 20]}
          defaultRowsPerPage={limit}
          showSearch={true}
          searchPlaceholder="Search projects..."
          searchableColumns={["title", "client.name", "status"]}
          showSerialNumber={true}
          isLoading={isLoading}
          // ── Server-side pagination ───────────────────────────────────────
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
    </div>
  );
}