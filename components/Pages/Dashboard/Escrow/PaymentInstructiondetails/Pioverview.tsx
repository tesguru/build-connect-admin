import React from "react";

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString() : "N/A";

const PIOverview = ({ instruction }: any) => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Instruction Details</h1>

      <p className="text-gray-700 mb-8 leading-relaxed">
        {instruction?.note || "No note provided for this payment instruction."}
      </p>

      <div className="grid grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-bold mb-4">Payment</h2>
          <ul className="space-y-2">
            <li className="text-gray-700">
              Project: {instruction?.project?.title || "N/A"}
            </li>
            <li className="text-gray-700">
              Milestone: {instruction?.milestone?.name || "N/A"}
            </li>
            <li className="text-gray-700">
              Amount: ₦{Number(instruction?.amount ?? 0).toLocaleString()}
            </li>
            <li className="text-gray-700">
              Paid At: {formatDate(instruction?.paidAt)}
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Status Note</h2>
          <ul className="space-y-2">
            <li className="text-gray-700">
              {instruction?.statusUpdateNote || "No status note available."}
            </li>
            <li className="text-gray-500 text-sm">
              Last status change: {formatDate(instruction?.statusUpdatedAt)}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PIOverview;