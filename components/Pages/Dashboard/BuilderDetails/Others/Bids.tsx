import { SectionLoader } from '@/components/ui/Custom/LoadingState';
import { DataTable } from '@/components/ui/Datatable';
import React, { useState } from 'react';
import { useUsers } from '@/libs/hooks/useUsers';
import { UserDetailsProps } from '../../UserDetails/UserDetails';

const Bids = ({ id }: UserDetailsProps) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState('');

  const { bidQuery } = useUsers();
  const { data, isLoading } = bidQuery(id, {
    page,
    limit,
    search: search || undefined,
  });
  
  const bids = data?.data?.data || [];
  const totalCount: number = data?.data?.meta?.totalDocuments ?? bids.length;

  const tableData = bids.map((bid: any) => ({
    id: bid.id,
    projectTitle: bid.projectTitle,
    projectId: bid.projectId,
    bidAmount: `₦${bid.bidAmount?.toLocaleString() || '0'}`,
    status: bid.status,
    submittedAt: new Date(bid.submittedAt).toLocaleDateString(),
  }));

  const columns = [
    { key: 'projectTitle', header: 'Project Title' },
    { key: 'projectId', header: 'Project ID' },
    { key: 'bidAmount', header: 'Bid Amount' },
    { key: 'status', header: 'Status' },
    { key: 'submittedAt', header: 'Submitted Date' },
  ];


  if (isLoading) {
    return (
      <SectionLoader label="Loading bids..." />
    );
  }

 
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bids</h1>
      </div>

      <DataTable
        columns={columns}
        data={tableData}
        showSearch={true}
        searchPlaceholder="Search bids..."
        searchableColumns={['projectTitle', 'projectId', 'status']}
        isLoading={isLoading}
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

export default Bids;