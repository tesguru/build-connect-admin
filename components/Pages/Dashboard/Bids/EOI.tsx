import MetricsCard from "@/components/ui/Custom/MetricsCard";
import { DataTable } from "@/components/ui/Datatable";
import { useBid } from "@/libs/hooks/useBid";
import { AlertCircle, AlertTriangle, Building2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";

const COLUMNS = [
  {
    key: "project",
    header: "Project",
    render: (row: any) => <span>{row.project}</span>,
  },
  {
    key: "builder",
    header: "Builder",
    render: (row: any) => <span>{row.builder}</span>,
  },
  {
    key: "interestLevel",
    header: "Interest Level",
    render: (row: any) => <span>{row.interestLevel}</span>,
  },
  {
    key: "status",
    header: "Status",
    render: (row: any) => (
      <span
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          row.status === "accepted"
            ? "bg-green-100 text-green-700"
            : row.status === "rejected"
            ? "bg-red-100 text-red-700"
            : "bg-yellow-100 text-yellow-700" // pending
        }`}
      >
        {row.status?.charAt(0).toUpperCase() + row.status?.slice(1)}
      </span>
    ),
  },
  {
    key: "submittedDate",
    header: "Submitted Date",
    render: (row: any) => (
      <span>
        {row.submittedDate
          ? new Date(row.submittedDate).toLocaleDateString()
          : "N/A"}
      </span>
    ),
  },
];

const METRICS = [
  { icon: Building2, label: "Total EOIs", value: "24", isPositive: true },
  { icon: AlertCircle, label: "This week", value: "9", isPositive: false },
  { icon: AlertTriangle, label: "Unique Projects", value: "8", isPositive: true },
];

export default function EOI() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState('');

  const { expressionOfInterestMutation } = useBid();
  const { data, isLoading } = expressionOfInterestMutation({
    page,
    limit,
    search: search || undefined,
  });

 
  const rawData = data?.data?.data || [];
  const totalCount: number = data?.data?.meta?.totalDocuments ?? rawData.length;

  const tableData = useMemo(
    () =>
      rawData.map((item: any) => ({
        id: item.id,
        project: item.project?.title || "N/A",
        builder: item.builder?.name || "N/A",
        interestLevel: item.message || "N/A",
        status: item.status,
        submittedDate: item.sentAt,
      })),
    [rawData],
  );

  const actions = useMemo(
    () => [
      {
        label: "View",
        icon: <Eye className="w-4 h-4 text-gray-600" />,
        onClick: (row: any) => router.push(`/project-bid-details/${row.id}`),
      },
    ],
    [router],
  );

  return (
    <div className="bg-gray-50">
      <div>
        <p className="text-2xl font-bold">Expressions of Interest</p>
        <p className="text-md">
          Review builder expressions of interest for upcoming projects
        </p>
      </div>

      <MetricsCard metrics={METRICS} />

      <div className="max-w-7xl mx-auto">
        <DataTable
          columns={COLUMNS}
          data={tableData}
          actions={actions}
          rowsPerPageOptions={[5, 8, 10, 20]}
          defaultRowsPerPage={limit}
          showSearch={true}
          searchPlaceholder="Search expressions of interest..."
          searchableColumns={["project", "builder", "status"]}
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
    </div>
  );
}