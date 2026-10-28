"use client";

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '../DashboardLayout/DashboardLayout';
import { URLS } from '@/libs/constants/pageurl';
import AccountDeletionRequests from './AccountDeletion/AccountDeletionList';
import AdminAccounts from './AdminAccounts/AdminAccountsList';

const TABS = [
  { id: 'accountdeletion', label: 'Account Deletion' },
  { id: 'adminaccounts', label: 'Admin Accounts' },
];

export default function Settings() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState('accountdeletion');

  useEffect(() => {
    if (tabParam && TABS.some((tab) => tab.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.replace(`${pathname}?tab=${tabId}`, { scroll: false });
  };

  return (
    <DashboardLayout urlpath={URLS.DASHBOARD.SETTINGS}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="border-b border-gray-200 flex-1">
            <nav className="flex space-x-8" aria-label="Settings sections">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                  className={`
                    pb-4 px-1 text-sm font-medium transition-colors relative
                    ${activeTab === tab.id
                      ? 'text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                    }
                  `}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
        <div className="mt-6">
        {activeTab === 'accountdeletion' && <AccountDeletionRequests/>}
        {activeTab === 'adminaccounts' && <AdminAccounts/>}
        </div>
      </div>
    </DashboardLayout>
  );
}