import React, { useState } from 'react';
import DashboardLayout from '../DashboardLayout/DashboardLayout';
import { URLS } from '@/libs/constants/pageurl';
import Tickets from './Tickets/Tickets';


export default function Supports() {
  const [activeTab, setActiveTab] = useState('tickets');

  const tabs = [
    { id: 'tickets', label: 'Tickets' }
  ];

  return (
    <DashboardLayout urlpath={URLS.DASHBOARD.SUPPORT}>
      <div className="p-4">
        <div>
          <p className="text-2xl font-bold ">Supports Tickets</p>
             <p className="text-sm py-4">Manage and respond to users support requests </p>
        </div>
        <div className="flex items-center justify-between mb-6">
          <div className="border-b border-gray-200 flex-1">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
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
          {activeTab === 'tickets' && <Tickets/> }
        </div>
      </div>

    </DashboardLayout>
  );
}
