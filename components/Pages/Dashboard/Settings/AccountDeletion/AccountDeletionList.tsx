import { DataTable } from "@/components/ui/Datatable";
import { useUsers } from "@/libs/hooks/useUsers";
import { Eye, X, Check, XCircle } from "lucide-react";
import { useState, useMemo } from "react";
import { formatName } from "@/libs/utils/helpers";

const COLUMNS = [
  {
    key: "requestedBy",
    header: "Requested By",
    render: (row: any) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.userName}</span>
        <span className="text-xs text-gray-500">{row.userEmail}</span>
      </div>
    ),
  },
  {
    key: "phoneNumber",
    header: "Phone",
    render: (row: any) => <span>{row.phoneNumber || "N/A"}</span>,
  },
  {
    key: "reason",
    header: "Reason",
    render: (row: any) => (
      <span className="line-clamp-2 max-w-xs">{row.reason || "—"}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (row: any) => {
      const statusStyles: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-700",
        approved: "bg-green-100 text-green-700",
        rejected: "bg-red-100 text-red-700",
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
    key: "reviewNotes",
    header: "Review Notes",
    render: (row: any) => (
      <span className="line-clamp-2 max-w-xs">{row.reviewNotes || "—"}</span>
    ),
  },
  {
    key: "reviewedAt",
    header: "Reviewed At",
    render: (row: any) => (
      <span>
        {row.reviewedAt ? new Date(row.reviewedAt).toLocaleDateString() : "—"}
      </span>
    ),
  },
  {
    key: "createdAt",
    header: "Requested On",
    render: (row: any) => (
      <span>
        {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "N/A"}
      </span>
    ),
  },
];

export default function AccountDeletionRequests() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [notes, setNotes] = useState("");

  const { getAllAccountDeletionQuery, requestAccountDeletion } = useUsers();

  const { data, isLoading, refetch } = getAllAccountDeletionQuery({
    page,
    limit,
    search: search || undefined,
  });

  const rawData = data?.data?.data || [];
  const totalCount: number = data?.data?.meta?.totalDocuments ?? rawData.length;

  const tableData = useMemo(
    () =>
      rawData.map((item: any) => {
        const fullName = formatName(item.user?.firstName, item.user?.lastName);

        return {
          _raw: item,
          id: item.id,
          userName: fullName || "Unknown User",
          userEmail: item.user?.email || "N/A",
          phoneNumber: item.user?.phoneNumber,
          reason: item.reason,
          status: item.status,
          reviewNotes: item.reviewNotes,
          reviewedByAdminId: item.reviewedByAdminId,
          reviewedAt: item.reviewedAt,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
      }),
    [rawData],
  );

  const actions = useMemo(
    () => [
      {
        label: "Review",
        icon: <Eye className="w-4 h-4 text-gray-600" />,
        onClick: (row: any) => {
          setSelectedRequest(row);
          setNotes(row.reviewNotes || "");
        },
      },
    ],
    [],
  );

  const closeModal = () => {
    setSelectedRequest(null);
    setNotes("");
  };

  const handleResolve = (decision: "approved" | "rejected") => {
    if (!selectedRequest) return;

    requestAccountDeletion.mutate(
      {
        id: selectedRequest.id,
        data: { decision, notes },
      },
      {
        onSuccess: () => {
          closeModal();
          refetch?.();
        },
      },
    );
  };

  return (
    <div className="bg-gray-50 mb-4">
      <div>
        <p className="text-2xl font-bold">Account Deletion Requests</p>
        <p className="text-md text-gray-500">
          Manage and review user account deletion requests
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
          searchPlaceholder="Search account deletion requests..."
          searchableColumns={["userName", "userEmail", "status", "reason"]}
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

      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <p className="text-lg font-bold mb-1">Review Deletion Request</p>
            <p className="text-sm text-gray-500 mb-4">
              {selectedRequest.userName} · {selectedRequest.userEmail}
            </p>

            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 mb-1">Reason</p>
              <p className="text-sm text-gray-800 bg-gray-50 rounded-md p-3">
                {selectedRequest.reason || "—"}
              </p>
            </div>

            <div className="mb-4">
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                Review Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Add a note for this decision (optional)..."
                className="w-full text-sm border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleResolve("rejected")}
                disabled={requestAccountDeletion.isPending}
                className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-md py-2 text-sm font-medium disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
              <button
                onClick={() => handleResolve("approved")}
                disabled={requestAccountDeletion.isPending}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white hover:bg-green-700 rounded-md py-2 text-sm font-medium disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}