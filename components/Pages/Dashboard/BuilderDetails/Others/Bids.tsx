import Button from '@/components/ui/Button/Button';
import { SectionLoader } from '@/components/ui/Custom/LoadingState';
import { DataTable } from '@/components/ui/Datatable';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useUsers } from '@/libs/hooks/useUsers';
import { UserDetailsProps } from '../../UserDetails/UserDetails';

const Bids = ({ id }: UserDetailsProps) => {
  const router = useRouter();
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

  const handleClick = (row: any) => {
    const id = row.id; 
    router.push(`/bid-details/${id}`);
  };

  const actions = [
    {
      label: 'View',
      icon: (
        <div className="bg-blue-700 hover:bg-blue-700 text-white rounded-md mb-2 px-3 py-1.5 text-sm cursor-pointer transition">
          View
        </div>
      ),
      onClick: (row: any) => handleClick(row),
    },
  ];

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
        actions={actions}
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