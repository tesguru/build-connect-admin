import React from "react";
import { ExternalLink } from "lucide-react";

const WFOverview = ({ funding }: any) => {
  const proof = funding?.proofDocument;
  const proofUrl = proof?.publicUrl;
  const isImage = proof?.mimeType?.startsWith("image/");

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Funding Details</h1>

      <p className="text-gray-700 mb-8 leading-relaxed">
        {funding?.note || "No note provided for this wallet funding request."}
      </p>

      <div className="grid grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-bold mb-4">Payment Info</h2>
          <ul className="space-y-2">
            <li className="text-gray-700">
              Amount: ₦{Number(funding?.amount ?? 0).toLocaleString()}
            </li>
            <li className="text-gray-700">
              Reference: {funding?.reference || "N/A"}
            </li>
            <li className="text-gray-700">
              Payment Date:{" "}
              {funding?.paymentDate
                ? new Date(funding.paymentDate).toLocaleDateString()
                : "N/A"}
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Admin Decision</h2>
          <ul className="space-y-2">
            <li className="text-gray-700">
              {funding?.statusUpdateNote || "No decision note recorded."}
            </li>
            <li className="text-gray-500 text-sm">
              Verified:{" "}
              {funding?.verifiedAt
                ? new Date(funding.verifiedAt).toLocaleString()
                : "Not yet verified"}
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Proof of Payment</h2>
        {proofUrl ? (
          <div className="space-y-4">
            <a
              href={proofUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              {proof?.originalName || proof?.fileName || "View Document"}
            </a>
            {isImage && (
              <a href={proofUrl} target="_blank" rel="noopener noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={proofUrl}
                  alt="Proof of payment"
                  className="max-h-96 rounded-lg border border-gray-200 object-contain"
                />
              </a>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            The client did not attach a proof of payment.
          </p>
        )}
      </div>
    </div>
  );
};

export default WFOverview;