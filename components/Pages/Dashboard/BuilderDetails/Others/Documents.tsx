import Button from '@/components/ui/Button/Button';
import { DataTable } from '@/components/ui/Datatable';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useUsers } from '@/libs/hooks/useUsers';
import { UserDetailsProps } from '../../UserDetails/UserDetails';

const Documents = ({ id }: UserDetailsProps) => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState('');

  const { documentsQuery } = useUsers();
  const { data, isLoading, error } = documentsQuery(id, {
    page,
    limit,
    search: search || undefined,
  });
  
  const documents = data?.data?.data || [];
  const totalCount: number = data?.data?.meta?.totalDocuments ?? documents.length;

  const tableData = documents.map((doc: any) => ({
    id: doc.id,
    type: doc.type,
    status: doc.status,
    publicUrl: doc.publicUrl,
    createdAt: new Date(doc.createdAt).toLocaleDateString(),
    updatedAt: new Date(doc.updatedAt).toLocaleDateString(),
  }));

  const handleClick = (row: any) => {
    const id = row.id; 
    router.push(`/document-details/${id}`);
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
    { key: 'type', header: 'Document Type' },
    { key: 'status', header: 'Status' },
    { key: 'publicUrl', header: 'Public URL' },
    { key: 'createdAt', header: 'Created Date' },
    { key: 'updatedAt', header: 'Updated Date' },
  ];

 
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
      </div>

      <DataTable
        columns={columns}
        data={tableData}
        actions={actions}
        showSearch={true}
        searchPlaceholder="Search documents..."
        searchableColumns={['type', 'status']}
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

export default Documents;