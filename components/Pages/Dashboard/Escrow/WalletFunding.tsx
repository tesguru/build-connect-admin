import { DataTable } from "@/components/ui/Datatable";
import { useEscrow } from "@/libs/hooks/useEscrow";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { formatName } from "@/libs/utils/helpers";

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
      <span className="font-semibold">
        {row.currency} {Number(row.amount).toLocaleString()}
      </span>
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
    render: (row: any) => {
      const statusStyles: Record<string, string> = {
        pending_verification: "bg-yellow-100 text-yellow-700",
        verified: "bg-green-100 text-green-700",
        rejected: "bg-red-100 text-red-700",
        pending: "bg-gray-100 text-gray-700",
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
    key: "paymentDate",
    header: "Payment Date",
    render: (row: any) => (
      <span>
        {row.paymentDate
          ? new Date(row.paymentDate).toLocaleDateString()
          : "N/A"}
      </span>
    ),
  },
  {
    key: "verifiedAt",
    header: "Verified At",
    render: (row: any) => (
      <span>
        {row.verifiedAt ? new Date(row.verifiedAt).toLocaleDateString() : "—"}
      </span>
    ),
  },
  {
    key: "note",
    header: "Note",
    render: (row: any) => (
      <span className="text-sm text-gray-500">{row.note || "—"}</span>
    ),
  },
];

export default function WalletFunding() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState('');

  const { getWalletFundingQuery } = useEscrow();
  const { data, isLoading } = getWalletFundingQuery({
    page,
    limit,
    search: search || undefined,
  });

  const rawData = data?.data?.data || [];
  const totalCount: number = data?.data?.meta?.totalDocuments ?? rawData.length;

  const tableData = useMemo(
    () =>
      rawData.map((item: any) => ({
        // Keep full raw item to store on click
        _raw: item,

        // Display fields
        id: item.id,
        clientName:
          formatName(item.client?.name) ||
          formatName(item.client?.firstName, item.client?.lastName) ||
          "N/A",
        clientEmail: item.client?.email || "",
        amount: item.amount ?? 0,
        currency: item.currency || "NGN",
        reference: item.reference,
        status: item.status,
        paymentDate: item.paymentDate,
        verifiedAt: item.verifiedAt,
        note: item.note,
        proofDocument: item.proofDocument,
      })),
    [rawData],
  );

  const actions = useMemo(
    () => [
      {
        label: "View",
        icon: <Eye className="w-4 h-4 text-gray-600" />,
        onClick: (row: any) => {
          // Store full raw item — detail page reads this as fallback while API isn't ready
          sessionStorage.setItem(
            "wallet_funding_detail",
            JSON.stringify(row._raw),
          );
          router.push(`/wallet-funding-details/${row.id}`);
        },
      },
    ],
    [router],
  );

  return (
    <div className="bg-gray-50 mb-4">
      <div>
        <p className="text-2xl font-bold">Wallet Funding</p>
        <p className="text-md text-gray-500">
          Review and verify client wallet funding requests
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
          searchableColumns={["clientName", "clientEmail", "reference", "status"]}
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