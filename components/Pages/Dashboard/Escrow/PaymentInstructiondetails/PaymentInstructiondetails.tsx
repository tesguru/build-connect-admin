import { User, Building2, Hash, RefreshCw } from "lucide-react";
import { URLS } from "@/libs/constants/pageurl";
import BackButton from "@/components/ui/BackButton";
import { InfoGrid, InfoItem } from "@/components/ui/Custom/Infogrid";
import DashboardLayout from "../../DashboardLayout/DashboardLayout";
import PIotherdetails from "./Piotherdetails";
import { useEscrow } from "@/libs/hooks/useEscrow";
import { useState } from "react";
import { NairaIcon } from "@/components/ui/Custom/NairaIcon";
import { PageLoader, Spinner } from "@/components/ui/Custom/LoadingState";

interface PaymentInstructionDetailsProps {
  id: string;
}

const statusStyles: Record<string, string> = {
  instruction_sent: "bg-blue-100 text-blue-700",
  paid: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-purple-100 text-purple-700",
  failed: "bg-red-100 text-red-700",
  reversed: "bg-orange-100 text-orange-700",
};

const STATUS_OPTIONS = [
  { value: "instruction_sent", label: "Instruction Sent" },
  { value: "processing", label: "Processing" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "reversed", label: "Reversed" },
  { value: "cancelled", label: "Cancelled" },
];

const PaymentInstructionDetails = ({ id }: PaymentInstructionDetailsProps) => {
  const { updatePaymentInstructions } = useEscrow();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [updateError, setUpdateError] = useState<string | null>(null);

  // --- Temporary fallback until API is ready ---
  const stored =
    typeof window !== "undefined"
      ? sessionStorage.getItem("payment_instruction_detail")
      : null;
  const cached = stored ? JSON.parse(stored) : null;
  const instruction = cached;
  // ---------------------------------------------

  if (!instruction) {
    return (
      <DashboardLayout urlpath={URLS.DASHBOARD.ESCROW}>
        <div className="bg-gray-50 min-h-screen">
          <div className="p-4">
            <BackButton label="Back" />
            <PageLoader label="Loading payment instruction..." />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const statusLabel = instruction.status
    ?.replace(/_/g, " ")
    .replace(/\b\w/g, (c: string) => c.toUpperCase());

  const statusStyle =
    statusStyles[instruction.status] ?? "bg-gray-100 text-gray-700";

  const infoItems: InfoItem[] = [
    {
      icon: User,
      label: "Client",
      value:
        instruction.client?.name ||
        instruction.client?.email ||
        "Not specified",
    },
    {
      icon: Building2,
      label: "Builder",
      value:
        instruction.builder?.name ||
        instruction.builder?.email ||
        "Not specified",
    },
    {
      icon: NairaIcon,
      label: "Amount",
      value: instruction.amount
        ? `${instruction.currency ?? "NGN"} ${Number(instruction.amount).toLocaleString()}`
        : "N/A",
    },
    {
      icon: Hash,
      label: "Milestone",
      value: instruction.milestone?.name ?? "N/A",
    },
  ];

  const handleOpenModal = () => {
    setSelectedStatus(instruction.status ?? "");
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
      { instructionId:id, status: selectedStatus, statusUpdateNote: statusNote },
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
                    {instruction.project?.title ?? "Payment Instruction"}
                  </h1>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-md ${statusStyle}`}
                  >
                    {statusLabel}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Instruction ID: {instruction.id}
                </p>
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

          <PIotherdetails instruction={instruction} />
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
              Update Payment Status
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Select a new status for this payment instruction.
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

export default PaymentInstructionDetails;