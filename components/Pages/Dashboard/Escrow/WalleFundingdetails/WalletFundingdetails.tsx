import { User, Hash, FileText, RefreshCw } from "lucide-react";
import { URLS } from "@/libs/constants/pageurl";
import BackButton from "@/components/ui/BackButton";
import { InfoGrid, InfoItem } from "@/components/ui/Custom/Infogrid";
import { useEscrow } from "@/libs/hooks/useEscrow";
import WFOtherdetails from "./Wfotherdetails";
import DashboardLayout from "../../DashboardLayout/DashboardLayout";
import { useState } from "react";
import { formatName } from "@/libs/utils/helpers";
import { NairaIcon } from "@/components/ui/Custom/NairaIcon";
import { PageLoader, Spinner } from "@/components/ui/Custom/LoadingState";

interface WalletFundingDetailsProps {
  id: string;
}

const statusStyles: Record<string, string> = {
  pending_verification: "bg-yellow-100 text-yellow-700",
  verified: "bg-green-100 text-green-700",
  successful: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  pending: "bg-gray-100 text-gray-700",
};

const STATUS_OPTIONS = [
  { value: "pending_verification", label: "Pending Verification" },
  { value: "successful", label: "Successful" },
  { value: "rejected", label: "Rejected" },
];

const WalletFundingDetails = ({ id }: WalletFundingDetailsProps) => {
  const { updateWalletFunding } = useEscrow();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [updateError, setUpdateError] = useState<string | null>(null);

  // --- Temporary fallback until API is ready ---
  const stored =
    typeof window !== "undefined"
      ? sessionStorage.getItem("wallet_funding_detail")
      : null;
  const cached = stored ? JSON.parse(stored) : null;
  const funding = cached;
  // ---------------------------------------------

  if (!funding) {
    return (
      <DashboardLayout urlpath={URLS.DASHBOARD.ESCROW}>
        <div className="bg-gray-50 min-h-screen">
          <div className="p-4">
            <BackButton label="Back" />
            <PageLoader label="Loading wallet funding..." />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const statusLabel = funding.status
    ?.replace(/_/g, " ")
    .replace(/\b\w/g, (c: string) => c.toUpperCase());

  const statusStyle =
    statusStyles[funding.status] ?? "bg-gray-100 text-gray-700";

  const clientName =
    formatName(funding.client?.name) ||
    formatName(funding.client?.firstName, funding.client?.lastName) ||
    "Not specified";

  const infoItems: InfoItem[] = [
    {
      icon: User,
      label: "Client",
      value: clientName,
    },
    {
      icon: NairaIcon,
      label: "Amount",
      value: funding.amount
        ? `${funding.currency ?? "NGN"} ${Number(funding.amount).toLocaleString()}`
        : "N/A",
    },
    {
      icon: Hash,
      label: "Reference",
      value: funding.reference ?? "N/A",
    },
    {
      icon: FileText,
      label: "Note",
      value: funding.note ?? "No note provided",
    },
  ];

  const handleOpenModal = () => {
    setSelectedStatus(funding.status ?? "");
    setStatusNote("");
    setUpdateError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUpdateError(null);
  };

  const handleUpdate = () => {
    if (!selectedStatus) return;
    setUpdateError(null);
    updateWalletFunding.mutate(
      { fundingId:id, status: selectedStatus, statusUpdateNote: statusNote },
      {
        onSuccess: () => setIsModalOpen(false),
        onError: (err: any) =>
          setUpdateError(
            err?.message ?? "Failed to update status. Please try again.",
          ),
      },
    );
  };

  return (
    <DashboardLayout urlpath={URLS.DASHBOARD.ESCROW}>
      <div className="bg-gray-50 min-h-screen">
        <div className="p-4">
          <BackButton label="Back" />

          <div className="p-4">
            <div className="flex justify-between mb-6">
              {/* Left — title + status badge */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Wallet Funding
                  </h1>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-md ${statusStyle}`}
                  >
                    {statusLabel}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Funding ID: {funding.id}</p>
              </div>

              {/* Right — Update Status button */}
              <div className="flex items-start">
                <button
                  onClick={handleOpenModal}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Update Status
                </button>
              </div>
            </div>

            <InfoGrid items={infoItems} />
          </div>

          <WFOtherdetails funding={funding} />
        </div>
      </div>

      {/* ── Update Status Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={handleCloseModal}
          />

          {/* Modal card */}
          <div className="relative z-10 bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Update Funding Status
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Select a new status for this wallet funding request.
            </p>

            {/* Status dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="" disabled>
                  Select a status...
                </option>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Optional note */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                rows={3}
                placeholder="Add a note about this status change..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Error message */}
            {updateError && (
              <p className="text-sm text-red-600 mb-4">{updateError}</p>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                disabled={updateWalletFunding.isPending}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={!selectedStatus || updateWalletFunding.isPending}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateWalletFunding.isPending ? (
                  <>
                    <Spinner className="h-4 w-4" />
                    Updating...
                  </>
                ) : (
                  "Update Status"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default WalletFundingDetails;