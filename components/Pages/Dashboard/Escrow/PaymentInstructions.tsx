import { DataTable } from "@/components/ui/Datatable";
import { useEscrow } from "@/libs/hooks/useEscrow";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { formatName } from "@/libs/utils/helpers";

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
    render: (row: any) => <span>{row.milestone}</span>,
  },
  {
    key: "amount",
    header: "Amount",
    render: (row: any) => (
      <span className="font-semibold">
        {row.currency} {Number(row.amount).toLocaleString()}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (row: any) => {
      const statusStyles: Record<string, string> = {
        instruction_sent: "bg-blue-100 text-blue-700",
        paid: "bg-green-100 text-green-700",
        cancelled: "bg-red-100 text-red-700",
        pending: "bg-yellow-100 text-yellow-700",
      };
      const style = statusStyles[row.status] || "bg-gray-100 text-gray-700";
      const label = row.status
        ?.replace(/_/g, " ")
        .replace(/\b\w/g, (c: string) => c.toUpperCase());
      return (
        <span className={`px-3 py-1 rounded-md text-sm font-medium ${style}`}>
          {label}
        </span>
      );
    },
  },
  {
    key: "instructionSentAt",
    header: "Instruction Sent",
    render: (row: any) => (
      <span>
        {row.instructionSentAt
          ? new Date(row.instructionSentAt).toLocaleDateString()
          : "N/A"}
      </span>
    ),
  },
  {
    key: "paidAt",
    header: "Paid At",
    render: (row: any) => (
      <span>
        {row.paidAt ? new Date(row.paidAt).toLocaleDateString() : "—"}
      </span>
    ),
  },
];

export default function PaymentInstructions() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState('');

  const { paymentInstructions } = useEscrow();
  const { data, isLoading } = paymentInstructions({
    page,
    limit,
    search: search || undefined,
  });

  const rawData = data?.data?.data || [];
  const totalCount: number = data?.data?.meta?.totalDocuments ?? rawData.length;

  const tableData = useMemo(
    () =>
      rawData.map((item: any) => ({
        // Keep full raw item so we can store it on click
        _raw: item,

        // Display fields
        id: item.id,
        project: item.project?.title || "N/A",
        client:
          formatName(item.client?.name) ||
          formatName(item.client?.firstName, item.client?.lastName) ||
          item.client?.email ||
          "N/A",
        builder:
          formatName(item.builder?.name) ||
          formatName(item.builder?.firstName, item.builder?.lastName) ||
          item.builder?.email ||
          "N/A",
        milestone: item.milestone?.name || "N/A",
        amount: item.amount ?? 0,
        currency: item.currency || "NGN",
        status: item.status,
        instructionSentAt: item.instructionSentAt,
        paidAt: item.paidAt,
        note: item.note,
      })),
    [rawData],
  );

  const actions = useMemo(
    () => [
      {
        label: "View",
        icon: <Eye className="w-4 h-4 text-gray-600" />,
        onClick: (row: any) => {
          sessionStorage.setItem(
            "payment_instruction_detail",
            JSON.stringify(row._raw),
          );
          router.push(`/payment-instruction-details/${row.id}`);
        },
      },
    ],
    [router],
  );

  return (
    <div className="bg-gray-50 mb-4">
      <div>
        <p className="text-2xl font-bold">Payment Instructions</p>
        <p className="text-md text-gray-500">
          Manage and track all escrow payment instructions
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
          searchableColumns={["project", "client", "builder", "status"]}
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