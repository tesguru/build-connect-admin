import { User, Building2, Hash, RefreshCw } from "lucide-react";
import { URLS } from "@/libs/constants/pageurl";
import BackButton from "@/components/ui/BackButton";
import { InfoGrid, InfoItem } from "@/components/ui/Custom/Infogrid";
import DashboardLayout from "../../DashboardLayout/DashboardLayout";
import PIotherdetails from "./Piotherdetails";
import { useEscrow } from "@/libs/hooks/useEscrow";
import { useState } from "react";
import { cleanName, formatStatus } from "@/libs/utils/helpers";
import { NairaIcon } from "@/components/ui/Custom/NairaIcon";
import { PageLoader, Spinner } from "@/components/ui/Custom/LoadingState";

interface PaymentInstructionDetailsProps {
  id: string;
}

const statusStyles: Record<string, string> = {
  instruction_sent: "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  paid: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  reversed: "bg-orange-100 text-orange-700",
  cancelled: "bg-gray-100 text-gray-700",
};

// instruction_sent and cancelled are set by the system, not by the admin status endpoint.
const STATUS_OPTIONS = [
  { value: "processing", label: "Processing" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "reversed", label: "Reversed" },
];

const PaymentInstructionDetails = ({ id }: PaymentInstructionDetailsProps) => {
  const { paymentInstructionDetailQuery, updatePaymentInstructions } = useEscrow();
  const { data, isLoading, error } = paymentInstructionDetailQuery(id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [updateError, setUpdateError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <DashboardLayout urlpath={URLS.DASHBOARD.ESCROW}>
        <PageLoader label="Loading payment instruction..." />
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

  const instruction = data.data.data;

  const infoItems: InfoItem[] = [
    {
      icon: User,
      label: "Client",
      value: cleanName(instruction.client?.name) || instruction.client?.email || "Not specified",
    },
    {
      icon: Building2,
      label: "Builder",
      value: cleanName(instruction.builder?.name) || instruction.builder?.email || "Unassigned",
    },
    {
      icon: NairaIcon,
      label: "Amount",
      value: `₦${Number(instruction.amount ?? 0).toLocaleString()}`,
    },
    {
      icon: Hash,
      label: "Milestone",
      value: instruction.milestone?.name ?? "N/A",
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
    updatePaymentInstructions.mutate(
      { instructionId: id, status: selectedStatus, statusUpdateNote: statusNote },
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
                    {instruction.project?.title ?? "Payment Instruction"}
                  </h1>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-md ${
                      statusStyles[instruction.status] ?? "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {formatStatus(instruction.status) || "N/A"}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Instruction ID: {instruction.id}
                </p>
              </div>

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

          <PIotherdetails instruction={instruction} />
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
              Update Payment Status
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Record the outcome of this ₦{Number(instruction.amount ?? 0).toLocaleString()} escrow
              payment to {cleanName(instruction.builder?.name) || "the builder"}.
            </p>

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

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                rows={3}
                maxLength={1000}
                placeholder="Add a note about this status change..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {updateError && (
              <p className="text-sm text-red-600 mb-4">{updateError}</p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                disabled={updatePaymentInstructions.isPending}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={!selectedStatus || updatePaymentInstructions.isPending}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updatePaymentInstructions.isPending ? (
                  <>
                    <Spinner className="h-4 w-4" />
                    Saving...
                  </>
                ) : selectedStatus ? (
                  `Mark as ${formatStatus(selectedStatus)}`
                ) : (
                  "Confirm Status"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PaymentInstructionDetails;