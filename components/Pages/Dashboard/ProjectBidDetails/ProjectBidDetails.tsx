'use client';

import React from 'react';
import DashboardLayout from '../DashboardLayout/DashboardLayout';
import BackButton from '@/components/ui/BackButton';
import { URLS } from '@/libs/constants/pageurl';
import { Building2, Calendar, MapPin, User, FileText, Download } from 'lucide-react';
import { NairaIcon } from '@/components/ui/Custom/NairaIcon';
import { InfoGrid, InfoItem } from '@/components/ui/Custom/Infogrid';
import { PageLoader } from '@/components/ui/Custom/LoadingState';
import { useUsers } from '@/libs/hooks/useUsers';
import { formatStatus } from '@/libs/utils/helpers';

interface ProjectBidDetailsProps {
  bidId: string;
  userId: string;
}

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  under_review: 'bg-blue-100 text-blue-700',
  shortlisted: 'bg-purple-100 text-purple-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  withdrawn: 'bg-gray-100 text-gray-600',
};

const formatNaira = (value?: number | string | null) =>
  value === null || value === undefined || value === ''
    ? '—'
    : `₦${Number(value).toLocaleString()}`;

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const ProjectBidDetails = ({ bidId, userId }: ProjectBidDetailsProps) => {
  const { bidDetailQuery } = useUsers();
  const { data, isLoading, error } = bidDetailQuery(userId, bidId);
  const bid = data?.data?.data;

  const shell = (children: React.ReactNode) => (
    <DashboardLayout urlpath={URLS.DASHBOARD.BID}>
      <div className="bg-gray-50 min-h-screen">
        <div className="p-4">
          <BackButton label="Back" />
          {children}
        </div>
      </div>
    </DashboardLayout>
  );

  if (isLoading) {
    return shell(<PageLoader label="Loading bid details..." />);
  }

  if (error || !bid) {
    return shell(
      <div className="mt-4 p-8 text-center text-sm text-gray-500">No data available</div>,
    );
  }

  const project = bid.project ?? {};
  const builder = bid.builder;
  const attachments = bid.attachments ?? [];
  const costBreakdown = project.costBreakdown ?? [];

  const infoItems: InfoItem[] = [
    { icon: Building2, label: 'Project', value: project.title ?? '—' },
    { icon: User, label: 'Builder', value: builder?.name ?? '—' },
    { icon: NairaIcon, label: 'Bid Amount', value: formatNaira(bid.bidAmount) },
    { icon: MapPin, label: 'Location', value: project.location ?? '—' },
    { icon: Calendar, label: 'Submitted', value: formatDate(bid.submittedAt) },
    {
      icon: Calendar,
      label: 'Timeline',
      value:
        project.startDate || project.endDate
          ? `${formatDate(project.startDate)} – ${formatDate(project.endDate)}`
          : project.proposedTimeline ?? '—',
    },
  ];

  return shell(
    <>
      <div className="mt-4 flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{project.title ?? 'Bid Details'}</h1>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                statusStyles[bid.status] ?? 'bg-gray-100 text-gray-600'
              }`}
            >
              {formatStatus(bid.status)}
            </span>
          </div>
          <p className="text-sm text-gray-500">Bid ID: {bid.id}</p>
          {builder && (
            <p className="text-sm text-gray-500 mt-1">
              {builder.name}
              {builder.email ? ` · ${builder.email}` : ''}
              {builder.phoneNumber ? ` · ${builder.phoneNumber}` : ''}
            </p>
          )}
        </div>
      </div>

      <InfoGrid items={infoItems} />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 sm:gap-6">
        <div className="border border-gray-300 rounded-lg p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Description</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            {project.description ?? 'No description provided.'}
          </p>

          {project.proposedTimeline && (
            <>
              <h3 className="text-base font-semibold text-gray-900 mb-2 mt-6">Proposed Timeline</h3>
              <p className="text-sm text-gray-700">{project.proposedTimeline}</p>
            </>
          )}

          {project.keyFeatures?.length > 0 && (
            <>
              <h3 className="text-base font-semibold text-gray-900 mb-3 mt-6">Key Features</h3>
              <ul className="space-y-2">
                {project.keyFeatures.map((feature: string, index: number) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {attachments.length > 0 && (
            <>
              <h3 className="text-base font-semibold text-gray-900 mb-3 mt-6">Attachments</h3>
              <div className="space-y-2">
                {attachments.map((file: any) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                    </div>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:underline"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="border border-gray-300 rounded-lg p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Cost Breakdown</h2>

          {costBreakdown.length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Items</span>
                <span className="text-sm font-medium text-gray-600">Amount</span>
              </div>
              {costBreakdown.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-3 border-b border-gray-100"
                >
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <span className="text-sm font-medium text-gray-900">{formatNaira(item.amount)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No cost breakdown provided.</p>
          )}

          <div className="flex justify-between items-center pt-4 mt-4 border-t-2 border-gray-200">
            <span className="text-sm font-semibold text-gray-900">Total Bid Payment</span>
            <span className="text-sm font-bold text-gray-900">
              {formatNaira(project.totalBidPayment ?? bid.bidAmount)}
            </span>
          </div>
        </div>
      </div>
    </>,
  );
};

export default ProjectBidDetails;
