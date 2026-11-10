import { DataTable } from "@/components/ui/Datatable";
import { useEscrow } from "@/libs/hooks/useEscrow";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { cleanName, formatStatus } from "@/libs/utils/helpers";

const statusStyles: Record<string, string> = {
  pending_verification: "bg-amber-100 text-amber-800",
  successful: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const COLUMNS = [
  {
    key: "client",
    header: "Client",
    render: (row: any) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.clientName}</span>
        <span className="text-xs text-gray-400">{row.clientEmail}</span>
      </div>
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
    key: "reference",
    header: "Reference",
    render: (row: any) => (
      <span className="text-sm font-mono">{row.reference || "—"}</span>
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
    key: "paymentDate",
    header: "Payment Date",
    render: (row: any) => (
      <span>
        {row.paymentDate ? new Date(row.paymentDate).toLocaleDateString() : "N/A"}
      </span>
    ),
  },
];

export default function WalletFunding() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);

  const { getWalletFundingQuery } = useEscrow();
  const { data, isLoading } = getWalletFundingQuery({
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
        clientName: cleanName(item.client?.name) || item.client?.email || "N/A",
        clientEmail: item.client?.email || "",
        amount: item.amount ?? 0,
        reference: item.reference,
        status: item.status,
        paymentDate: item.paymentDate,
      })),
    [rawData],
  );

  const actions = useMemo(
    () => [
      {
        label: "View",
        icon: <Eye className="w-4 h-4 text-gray-600" />,
        onClick: (row: any) => router.push(`/wallet-funding-details/${row.id}`),
      },
    ],
    [router],
  );

  return (
    <div className="bg-gray-50 mb-4">
      <div>
        <p className="text-2xl font-bold">Wallet Funding</p>
        <p className="text-md text-gray-500">
          Check the proof of payment, then approve to credit the client&apos;s wallet or reject the request
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
          searchPlaceholder="Search wallet funding..."
          searchableColumns={["clientName", "clientEmail", "reference"]}
          filters={[
            {
              key: "status",
              label: "Status",
              options: [
                { value: "pending_verification", label: "Pending Verification" },
                { value: "successful", label: "Successful" },
                { value: "rejected", label: "Rejected" },
              ],
            },
          ]}
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