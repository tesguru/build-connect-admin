import { DataTable } from "@/components/ui/Datatable";
import { useState, useMemo } from "react";
import { useDashboard } from "@/libs/hooks/useDashboard";
import { cleanName, formatMoneyInText, formatStatus } from "@/libs/utils/helpers";

const ACTIVITY_TYPES = [
  'user_registered',
  'project_created',
  'bid_submitted',
  'interest_expressed',
  'contract_generated',
  'contract_signed',
  'payment_instruction_sent',
] as const;

const typeStyles: Record<string, string> = {
  user_registered: 'bg-blue-100 text-blue-700',
  project_created: 'bg-indigo-100 text-indigo-700',
  bid_submitted: 'bg-purple-100 text-purple-700',
  interest_expressed: 'bg-amber-100 text-amber-700',
  contract_generated: 'bg-cyan-100 text-cyan-700',
  contract_signed: 'bg-green-100 text-green-700',
  payment_instruction_sent: 'bg-rose-100 text-rose-700',
};

const formatDateTime = (value?: string | null) =>
  value ? new Date(value).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

export default function RecentActivity() {
  const [activeTab, setActiveTab] = useState<string>('all');

  const { getRecentActivity } = useDashboard();
  const { data, isLoading, error } = getRecentActivity({ limit: 100 });

  const activities = useMemo(
    () =>
      ((data?.data?.data as any[]) ?? []).map((item: any) => ({
        id: item.id,
        type: item.type,
        typeLabel: formatStatus(item.type) || '—',
        description: formatMoneyInText(item.description ?? "—"),
        actor: cleanName(item.actor?.name) || 'System',
        entity: item.entityType ? `${formatStatus(item.entityType)} · ${item.entityId ?? '—'}` : '—',
        occurredAt: item.occurredAt,
      })),
    [data],
  );

  const tabs = useMemo(
    () => [
      { name: 'all', label: 'All Activities', count: activities.length },
      ...ACTIVITY_TYPES.map((type) => ({
        name: type,
        label: formatStatus(type),
        count: activities.filter((activity) => activity.type === type).length,
      })),
    ],
    [activities],
  );

  const filteredActivities = useMemo(
    () => (activeTab === 'all' ? activities : activities.filter((activity) => activity.type === activeTab)),
    [activities, activeTab],
  );

  const columns = [
    {
      key: 'typeLabel',
      header: 'Type',
      render: (row: any) => (
        <span className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${typeStyles[row.type] ?? 'bg-gray-100 text-gray-700'}`}>
          {row.typeLabel}
        </span>
      ),
    },
    {
      key: 'description',
      header: 'Activity',
      render: (row: any) => <span className="text-gray-900">{row.description}</span>,
    },
    {
      key: 'actor',
      header: 'Actor',
      render: (row: any) => <span className="text-gray-700">{row.actor}</span>,
    },
    {
      key: 'occurredAt',
      header: 'Date',
      render: (row: any) => <span className="text-gray-500 whitespace-nowrap">{formatDateTime(row.occurredAt)}</span>,
    },
  ];

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h1>

        <div className="border-b border-gray-200 mb-6 overflow-x-auto">
          <nav className="flex space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`pb-3 px-1 text-sm font-medium whitespace-nowrap transition-colors relative ${
                  activeTab === tab.name ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                <span className="ml-1.5 text-xs text-gray-400">{tab.count}</span>
                {activeTab === tab.name && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            ))}
          </nav>
        </div>

        <DataTable
          columns={columns}
          data={filteredActivities}
          rowsPerPageOptions={[8, 10, 20, 50]}
          defaultRowsPerPage={8}
          showSearch={true}
          searchPlaceholder="Search activity..."
          searchableColumns={["typeLabel", "description", "actor"]}
          showSerialNumber={true}
          isLoading={isLoading}
          emptyMessage={error ? 'No data available' : 'No activity yet'}
        />
      </div>
    </div>
  );
}
