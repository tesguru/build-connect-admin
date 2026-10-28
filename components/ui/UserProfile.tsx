"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, LogOut } from 'lucide-react';
import Image from 'next/image';
import { AvatarImage } from '@/libs/constants/image';
import { useAuthStore } from '@/libs/store/Authstore';
import { useAuth } from '@/libs/hooks/useAuth';
import { formatName } from '@/libs/utils/helpers';

export default function UserProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { users, loadAuthData } = useAuthStore();
  const { logout } = useAuth();

  useEffect(() => {
    if (!users) loadAuthData();
  }, [users, loadAuthData]);

  const displayName = users ? formatName(users.firstName, users.lastName) : '';

  const handleManageAccount = () => {
    setIsOpen(false);
    router.push('/settings?tab=adminaccounts');
  };

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Account menu"
      >
        <Image
          src={AvatarImage}
          alt="User Avatar"
          className="w-full h-full object-cover"
        />
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div
            role="menu"
            className="absolute right-0 mt-3 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl border border-gray-200 shadow-xl z-20 overflow-hidden"
          >
            <div className="px-6 pt-6 pb-5 flex flex-col items-center border-b border-gray-100">
              <div className="w-20 h-20 rounded-full overflow-hidden mb-3 ring-4 ring-blue-50">
                <Image
                  src={AvatarImage}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center">
                {displayName ? `Hi, ${displayName}!` : 'Hi there!'}
              </h3>
              {users?.email && (
                <p className="text-sm text-gray-500 mt-1 truncate max-w-full">{users.email}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 p-4">
              <button
                onClick={handleManageAccount}
                className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl py-3 px-4 transition-colors"
              >
                <User size={18} className="text-gray-700" />
                <span className="text-sm text-gray-700 font-medium">Manage Account</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-xl py-3 px-4 transition-colors group"
              >
                <LogOut size={18} className="text-gray-700 group-hover:text-red-600" />
                <span className="text-sm text-gray-700 group-hover:text-red-600 font-medium">
                  Log Out
                </span>
              </button>
            </div>

            <p className="px-6 pb-5 text-center text-xs text-gray-400">
              © 2026 BUILDCONNECT
            </p>
          </div>
        </>
      )}
    </div>
  );
}
