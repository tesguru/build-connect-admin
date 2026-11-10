import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from '@/components/ui/Button/Button';
import { useUsers } from '@/libs/hooks/useUsers';
import { formatStatus } from '@/libs/utils/helpers';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'verified', label: 'Verified' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'not_started', label: 'Not Started' },
];

const chipStyles: Record<string, string> = {
  verified: 'bg-green-600 text-white',
  pending: 'bg-amber-500 text-white',
  rejected: 'bg-red-600 text-white',
  not_started: 'bg-gray-600 text-white',
};

const dotStyles: Record<string, string> = {
  verified: 'bg-green-600',
  pending: 'bg-amber-500',
  rejected: 'bg-red-600',
  not_started: 'bg-gray-500',
};

interface VerificationStatusProps {
  id: string;
  name: string;
  status?: string | null;
}

const VerificationStatus = ({ id, name, status }: VerificationStatusProps) => {
  const current = status ?? 'pending';
  const { updateUserStatusMutation } = useUsers();
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState(current);

  const openModal = () => {
    setDraft(current);
    setIsOpen(true);
  };

  const handleSave = () => {
    updateUserStatusMutation.mutate(
      {
        id,
        data: { verificationStatus: draft, isVerified: draft === 'verified' },
      },
      { onSuccess: () => setIsOpen(false) },
    );
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <span
          className={`px-3 py-1.5 rounded-md text-sm font-bold ${
            chipStyles[current] ?? 'bg-gray-600 text-white'
          }`}
        >
          {formatStatus(current) || 'Pending'}
        </span>
        <button
          type="button"
          onClick={openModal}
          className="px-3 py-1.5 rounded-md text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors"
        >
          Update Status
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/40 backdrop-blur-[2px] p-4">
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              className="absolute -top-5 -right-5 w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-gray-800 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Verification Status</h2>
            </div>

            <div className="px-6 py-6 space-y-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">User</p>
                <p className="text-lg font-semibold text-gray-900 break-words">{name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Current status</p>
                <p className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      dotStyles[current] ?? 'bg-gray-500'
                    }`}
                  />
                  {formatStatus(current) || 'Pending'}
                </p>
              </div>

              <div>
                <label
                  htmlFor="verification-status"
                  className="block text-sm text-gray-500 mb-1"
                >
                  New status
                </label>
                <select
                  id="verification-status"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  disabled={updateUserStatusMutation.isPending}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="px-6 pb-6">
              <Button
                onClick={handleSave}
                loading={updateUserStatusMutation.isPending}
                disabled={draft === current}
                className="w-full py-3 text-base font-semibold rounded-lg"
              >
                Update Status
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VerificationStatus;