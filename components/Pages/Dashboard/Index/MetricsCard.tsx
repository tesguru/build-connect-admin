import React from 'react';
import { Building2, AlertCircle, AlertTriangle } from 'lucide-react';
import { useDashboard } from '@/libs/hooks/useDashboard';
import MetricsCard from '@/components/ui/Custom/MetricsCard';
import { NairaIcon } from '@/components/ui/Custom/NairaIcon';

const formatNaira = (value?: number | string | null) => {
  const amount = Number(value ?? 0);
  return Number.isFinite(amount) ? `₦${amount.toLocaleString()}` : '₦0';
};

export default function MetricsDashboard() {
  const { getAnalyticsQuery } = useDashboard();
  const { data, isError } = getAnalyticsQuery();

  const analytics = data?.data?.data ?? {};

  const metrics = [
    {
      icon: Building2,
      label: 'Active Projects',
      value: analytics?.activeProjects ?? 0,
    },
    {
      icon: AlertCircle,
      label: 'Pending Verifications',
      value: analytics?.pendingVerifications ?? 0,
    },
    {
      icon: AlertTriangle,
      label: 'Open Disputes',
      value: analytics?.openDisputes ?? 0,
    },
    {
      icon: NairaIcon,
      label: 'Total Escrow Value',
      value: formatNaira(analytics?.totalEscrowValue),
    },
  ];

  if (isError) {
    return (
      <div className="py-8 md:px-8">
        <div className="max-w-7xl mx-auto border border-gray-200 rounded-2xl bg-white">
          <div className="flex flex-col items-center justify-center text-center py-16 px-6">
            <p className="text-sm font-medium text-gray-700">No data available</p>
            <p className="text-xs text-gray-400 mt-1">
              We couldn&apos;t load the dashboard metrics right now.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <MetricsCard metrics={metrics} />;
}
