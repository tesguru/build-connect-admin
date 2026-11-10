import { DataTable } from "@/components/ui/Datatable";
import { useEscrow } from "@/libs/hooks/useEscrow";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { cleanName, formatStatus } from "@/libs/utils/helpers";

const statusStyles: Record<string, string> = {
  instruction_sent: "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  paid: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  reversed: "bg-orange-100 text-orange-700",
  cancelled: "bg-gray-100 text-gray-700",
};

const STATUS_OPTIONS = [
  { value: "instruction_sent", label: "Instruction Sent" },
  { value: "processing", label: "Processing" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "reversed", label: "Reversed" },
  { value: "cancelled", label: "Cancelled" },
];

const COLUMNS = [
  {
    key: "project",
    header: "Project",
    render: (row: any) => <span className="font-medium">{row.project}</span>,
  },
  {
    key: "client",
    header: "Client",
    render: (row: any) => <span>{row.client}</span>,
  },
  {
    key: "builder",
    header: "Builder",
    render: (row: any) => <span>{row.builder}</span>,
  },
  {
    key: "milestone",
    header: "Milestone",
    render: (row: any) => (
      <span className="block max-w-[220px] truncate" title={row.milestone}>
        {row.milestone}
      </span>
    ),
  },
  {
    key: "amount",
    header: "Amount",
    render: (row: any) => (
      <span className="font-semibold">₦{Number(row.amount).toLocaleString()}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (row: any) => (
      <span
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          statusStyles[row.status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {formatStatus(row.status) || "N/A"}
      </span>
    ),
  },
  {
    key: "paidAt",
    header: "Paid At",
    render: (row: any) => (
      <span>{row.paidAt ? new Date(row.paidAt).toLocaleDateString() : "—"}</span>
    ),
  },
];

export default function PaymentInstructions() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);

  const { paymentInstructions } = useEscrow();
  const { data, isLoading } = paymentInstructions({
    page,
    limit,
    search: search || undefined,
    status,
  });

  const rawData = data?.data?.data || [];
  const totalCount: number = data?.data?.meta?.totalDocuments ?? rawData.length;

  const tableData = useMemo(
    () =>
      rawData.map((item: any) => ({
        id: item.id,
        project: item.project?.title || "N/A",
        client: cleanName(item.client?.name) || item.client?.email || "N/A",
        builder: cleanName(item.builder?.name) || item.builder?.email || "Unassigned",
        milestone: item.milestone?.name || "N/A",
        amount: item.amount ?? 0,
        status: item.status,
        paidAt: item.paidAt,
      })),
    [rawData],
  );

  const actions = useMemo(
    () => [
      {
        label: "View",
        icon: <Eye className="w-4 h-4 text-gray-600" />,
        onClick: (row: any) => router.push(`/payment-instruction-details/${row.id}`),
      },
    ],
    [router],
  );

  return (
    <div className="bg-gray-50 mb-4">
      <div>
        <p className="text-2xl font-bold">Payment Instructions</p>
        <p className="text-md text-gray-500">
          Escrow payments released to builders against completed project milestones
        </p>
      </div>

      <div className="pt-4">
        <DataTable
          columns={COLUMNS}
          data={tableData}
          actions={actions}
          rowsPerPageOptions={[5, 8, 10, 20]}
          defaultRowsPerPage={limit}
          showSearch={true}
          searchPlaceholder="Search payment instructions..."
          searchableColumns={["project", "client", "builder", "milestone"]}
          filters={[{ key: "status", label: "Status", options: STATUS_OPTIONS }]}
          onFilterChange={(active) => {
            setStatus(active.status && active.status !== "all" ? active.status : undefined);
            setPage(1);
          }}
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