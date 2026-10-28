import MetricsCard from "@/components/ui/Custom/MetricsCard";
import { DataTable } from "@/components/ui/Datatable";
import { useBid } from "@/libs/hooks/useBid";
import { AlertCircle, AlertTriangle, Building2, Eye, XCircle } from "lucide-react";
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
    render: (row: any) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.builderName}</span>
        <span className="text-xs text-gray-400">{row.builderEmail}</span>
      </div>
    ),
  },
  {
    key: "bidAmount",
    header: "Bid Amount",
    render: (row: any) => (
      <span className="font-medium">
        {row.bidAmount !== null && row.bidAmount !== undefined
          ? `₦${Number(row.bidAmount).toLocaleString()}`
          : "N/A"}
      </span>
    ),
  },
  {
    key: "proposedTimeline",
    header: "Proposed Timeline",
    render: (row: any) => <span>{row.proposedTimeline || "N/A"}</span>,
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
];

const METRICS = [
  { icon: Building2,     label: "Total Bids",     value: "20", isPositive: true },
  { icon: AlertCircle,   label: "Pending Review", value: "9",  isPositive: false },
  { icon: AlertTriangle, label: "Approved",        value: "8",  isPositive: true },
  { icon: XCircle,       label: "Rejected",        value: "8",  isPositive: false },
];

export default function SubmittedBids() {
  const router = useRouter();
  const [page, setPage]   = useState(1);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState('');

  const { submittedQuery } = useBid();
  const { data, isLoading } = submittedQuery({
    page,
    limit,
    search: search || undefined,
  });

  // API shape: { data: [...], meta: { totalDocuments } }
  const rawData    = data?.data?.data  || [];
  const totalCount: number = data?.data?.meta?.totalDocuments ?? rawData.length;

  const tableData = useMemo(
    () =>
      rawData.map((item: any) => ({
        id:               item.id,
        project:          item.project?.title   || "N/A",
        builderName:      item.builder?.name    || "N/A",
        builderEmail:     item.builder?.email   || "",
        bidAmount:        item.bidAmount,
        proposedTimeline: item.proposedTimeline,
        submittedDate:    item.submittedAt,
        status:           item.status,
      })),
    [rawData],
  );

  const actions = useMemo(
    () => [
      {
        label: "View",
        icon: <Eye className="w-4 h-4 text-gray-600" />,
        onClick: (row: any) => router.push(`/milestone-details/${row.id}`),
      },
    ],
    [router],
  );

  return (
    <div className="bg-gray-50">
      <div>
        <p className="text-2xl font-bold">Submitted Bids</p>
        <p className="text-md">Review and manage all submitted project bids</p>
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
          searchPlaceholder="Search submitted bids..."
          searchableColumns={["project", "builderName", "status"]}
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
    </div>
  );
}