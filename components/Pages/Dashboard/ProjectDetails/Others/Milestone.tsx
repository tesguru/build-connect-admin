import ActionButton from '@/components/ui/Button/ActionButton';
import { SectionLoader } from '@/components/ui/Custom/LoadingState';
import { DataTable } from '@/components/ui/Datatable';
import { useProjects } from '@/libs/hooks/useProjects';
import { PlusIcon, ArrowLeft, RefreshCw } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import MileStoneDetails from './MileStoneDetails';

const Milestones = ({ project }: any) => {
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState('');

  const { getMilestoneQuery } = useProjects();
  const { 
    data, 
    isLoading: isMilestonesLoading, 
    error, 
    refetch 
  } = getMilestoneQuery(project?.id, {
    page,
    limit,
    search: search || undefined,
  });
  

  useEffect(() => {
    if (selectedMilestoneId === null && shouldRefetch) {
      refetch();
      setShouldRefetch(false);
    }
  }, [selectedMilestoneId, shouldRefetch, refetch]);

  const milestones = Array.isArray(data?.data?.data) ? data?.data?.data : [];
  const totalCount: number = data?.data?.meta?.totalDocuments ?? milestones.length;

  const handleViewMilestone = (row: any) => {
    setSelectedMilestoneId(row.id);
  };

  const handleBackToList = () => {
    setSelectedMilestoneId(null);
    setShouldRefetch(true); // Trigger refetch when going back
  };

  const handleManualRefresh = () => {
    refetch();
  };

  const actions = [
    {
      label: 'View',
      icon: (
        <div className="bg-blue-700 hover:bg-blue-700 text-white rounded-md mb-2 px-3 py-1.5 text-sm cursor-pointer transition">
          View
        </div>
      ),
      onClick: (row: any) => handleViewMilestone(row),
    },
  ];

  const columns = [
    { key: 'name', header: 'Milestone Name' },
    { key: 'description', header: 'Description' },
    { key: 'completionDate', header: 'Due Date' },
    { key: 'amount', header: 'Amount' },
    {
      key: 'status',
      header: 'Status',
      render: (row: any) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.status === 'completed'
              ? 'bg-green-100 text-green-800'
              : row.status === 'in-progress'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  // If a milestone is selected, show its details with a back button
  if (selectedMilestoneId) {
    return (
      <div>
        <button
          onClick={handleBackToList}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        
        <MileStoneDetails id={project.id} milestoneId={selectedMilestoneId} />
      </div>
    );
  }

  // Add loading state for milestones LIST only
  if (isMilestonesLoading) {
    return (
      <SectionLoader label="Loading milestones..." />
    );
  }

  // Add error state for milestones LIST only
  if (error) {
    return (
      <div className="text-center p-8 text-sm text-gray-500">
        No data available
        <button
          onClick={handleManualRefresh}
          className="ml-2 text-blue-600 hover:text-blue-800"
        >
          Retry
        </button>
      </div>
    );
  }

  // Prepare table data with additional safety check
  const tableData = Array.isArray(milestones) 
    ? milestones.map((milestone: any) => ({
        id: milestone.id,
        name: milestone.name,
        description: milestone.description,
        completionDate: milestone.completionDate
          ? new Date(milestone.completionDate).toLocaleDateString()
          : 'Not set',
        amount: milestone.amount
          ? `₦${milestone.amount.toLocaleString()}`
          : '₦0',
        status: milestone.status,
      }))
    : [];

  // Show empty state if no milestones
  if (totalCount === 0 && !search) {
    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Milestones</h1>
          <div className="flex gap-2">
           
            <ActionButton
              label="Add Milestone"
              icon={<PlusIcon />}
              href={`/create-milestones/${project.id}`}
            />
          </div>
        </div>
        
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 mb-4">No milestones found</p>
          <button
            onClick={handleManualRefresh}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Refresh to check for new milestones
          </button>
        </div>
      </>
    );
  }

  // Show the milestones list
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Milestones</h1>
        <div className="flex gap-2">
          <button
            onClick={handleManualRefresh}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <ActionButton
            label="Add Milestone"
            icon={<PlusIcon />}
            href={`/create-milestones/${project.id}`}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={tableData}
        actions={actions}
        showSearch={true}
        searchPlaceholder="Search milestones..."
        searchableColumns={['name', 'description', 'status']}
        isLoading={isMilestonesLoading}
        emptyMessage="No milestones found"
        rowsPerPageOptions={[5, 8, 10, 20]}
        defaultRowsPerPage={limit}
        serverSide={true}
        totalCount={totalCount}
        currentPage={page}
        onPageChange={(newPage) => setPage(newPage)}
        onSearchChange={(term) => {
          setSearch(term);
          setPage(1);
        }}
        onRowsPerPageChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
      />
    </>
  );
};

export default Milestones;