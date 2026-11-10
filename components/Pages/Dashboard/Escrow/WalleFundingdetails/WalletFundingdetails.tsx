import { User, Hash, CalendarDays, RefreshCw } from "lucide-react";
import { URLS } from "@/libs/constants/pageurl";
import BackButton from "@/components/ui/BackButton";
import { InfoGrid, InfoItem } from "@/components/ui/Custom/Infogrid";
import { useEscrow } from "@/libs/hooks/useEscrow";
import WFOtherdetails from "./Wfotherdetails";
import DashboardLayout from "../../DashboardLayout/DashboardLayout";
import { useState } from "react";
import { cleanName, formatStatus } from "@/libs/utils/helpers";
import { NairaIcon } from "@/components/ui/Custom/NairaIcon";
import { PageLoader, Spinner } from "@/components/ui/Custom/LoadingState";

interface WalletFundingDetailsProps {
  id: string;
}

const statusStyles: Record<string, string> = {
  pending_verification: "bg-amber-100 text-amber-800",
  successful: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

// The API only accepts a decision — a funding cannot be moved back to pending_verification.
const STATUS_OPTIONS = [
  { value: "successful", label: "Approve — credit the client's wallet" },
  { value: "rejected", label: "Reject — decline this funding" },
];

const WalletFundingDetails = ({ id }: WalletFundingDetailsProps) => {
  const { walletFundingDetailQuery, updateWalletFunding } = useEscrow();
  const { data, isLoading, error } = walletFundingDetailQuery(id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [updateError, setUpdateError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <DashboardLayout urlpath={URLS.DASHBOARD.ESCROW}>
        <PageLoader label="Loading wallet funding..." />
      </DashboardLayout>
    );
  }

  if (error || !data?.data?.data) {
    return (
      <DashboardLayout urlpath={URLS.DASHBOARD.ESCROW}>
        <BackButton label="Back" />
        <div className="text-center p-8 text-sm text-gray-500">
          No data available
        </div>
      </DashboardLayout>
    );
  }

  const funding = data.data.data;

  const infoItems: InfoItem[] = [
    {
      icon: User,
      label: "Client",
      value: cleanName(funding.client?.name) || funding.client?.email || "Not specified",
    },
    {
      icon: NairaIcon,
      label: "Amount",
      value: `₦${Number(funding.amount ?? 0).toLocaleString()}`,
    },
    {
      icon: Hash,
      label: "Reference",
      value: funding.reference ?? "N/A",
    },
    {
      icon: CalendarDays,
      label: "Payment Date",
      value: funding.paymentDate
        ? new Date(funding.paymentDate).toLocaleDateString()
        : "N/A",
    },
  ];

  const handleOpenModal = () => {
    setSelectedStatus("");
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
      { fundingId: id, status: selectedStatus, statusUpdateNote: statusNote },
      {
        onSuccess: () => setIsModalOpen(false),
        onError: (err: any) =>
          setUpdateError(
            err?.response?.data?.message ?? "Failed to update status. Please try again.",
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
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Wallet Funding
                  </h1>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-md ${
                      statusStyles[funding.status] ?? "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {formatStatus(funding.status) || "N/A"}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Funding ID: {funding.id}</p>
              </div>

              <div className="flex items-start">
                <button
                  onClick={handleOpenModal}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  {funding.status === "pending_verification" ? "Verify Funding" : "Update Status"}
                </button>
              </div>
            </div>

            <InfoGrid items={infoItems} />
          </div>

          <WFOtherdetails funding={funding} />
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={handleCloseModal}
          />

          <div className="relative z-10 bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Verify Wallet Funding
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Approving credits ₦{Number(funding.amount ?? 0).toLocaleString()} to{" "}
              {cleanName(funding.client?.name) || "the client"}&apos;s wallet. Rejecting leaves the
              wallet unchanged. Check the proof of payment first.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Decision <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="" disabled>
                  Select a decision...
                </option>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                rows={3}
                maxLength={1000}
                placeholder={
                  selectedStatus === "rejected"
                    ? "Why is this funding being rejected?"
                    : "Add a note about this decision..."
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {updateError && (
              <p className="text-sm text-red-600 mb-4">{updateError}</p>
            )}

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
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedStatus === "rejected"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {updateWalletFunding.isPending ? (
                  <>
                    <Spinner className="h-4 w-4" />
                    Saving...
                  </>
                ) : selectedStatus === "rejected" ? (
                  "Reject Funding"
                ) : selectedStatus === "successful" ? (
                  "Approve Funding"
                ) : (
                  "Confirm Decision"
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