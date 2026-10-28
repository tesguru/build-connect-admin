import React from 'react';
import { useProjects } from '@/libs/hooks/useProjects';
import { PageLoader } from '@/components/ui/Custom/LoadingState';

interface MileStoneDetailsProps {
  id: string;
  milestoneId: string;
}

const MileStoneDetails = ({ id, milestoneId }: MileStoneDetailsProps) => {
  const { getMilestoneDetailsQuery } = useProjects();
  console.log(id)
  const { data, isLoading, error } = getMilestoneDetailsQuery(id, milestoneId);
  
  const milestone = data?.data?.data;

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  // Loading state
  if (isLoading) {
    return <PageLoader label="Loading milestone..." />;
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6 sm:p-8">
        <p className="text-center text-sm text-gray-500">No data available</p>
      </div>
    );
  }

  // No data state
  if (!milestone) {
    return (
      <div className="max-w-4xl mx-auto  rounded-lg shadow-sm p-6 sm:p-8">
        <p className="text-gray-600">No milestone data found.</p>
      </div>
    );
  }

  return (
    <div className=" mx-auto  ">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
        {milestone.name}
      </h1>

      {/* Description */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Description
        </h2>
        <p className="text-gray-700">
          {milestone.description}
        </p>
      </section>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            milestone.status === 'completed' 
              ? 'bg-green-100 text-green-800'
              : milestone.status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-blue-100 text-blue-800'
          }`}>
            {milestone.status}
          </span>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Completion Date</h3>
          <p className="text-gray-900">{formatDate(milestone.completionDate)}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Amount</h3>
          <p className="text-gray-900">{formatCurrency(milestone.amount)}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Milestone ID</h3>
          <p className="text-gray-900 font-mono text-sm">{milestone.id}</p>
        </div>
      </div>

      {/* Payment Details */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Payment Details
        </h2>
        
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 grid grid-cols-2 gap-4">
            <div className="text-sm font-medium text-gray-700">Description</div>
            <div className="text-sm font-medium text-gray-700 text-right">Amount</div>
          </div>

          <div className="divide-y divide-gray-200">
            <div className="px-6 py-4 grid grid-cols-2 gap-4">
              <div className="text-gray-900">Milestone: {milestone.name}</div>
              <div className="text-gray-900 text-right font-medium">
                {formatCurrency(milestone.amount)}
              </div>
            </div>

            <div className="px-6 py-4 grid grid-cols-2 gap-4 bg-gray-50">
              <div className="text-gray-900 font-semibold">Total</div>
              <div className="text-gray-900 text-right font-semibold">
                {formatCurrency(milestone.amount)}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MileStoneDetails;