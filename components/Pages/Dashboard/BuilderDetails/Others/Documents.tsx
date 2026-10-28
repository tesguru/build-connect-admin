import { DataTable } from '@/components/ui/Datatable';
import React, { useState } from 'react';
import { useUsers } from '@/libs/hooks/useUsers';
import { UserDetailsProps } from '../../UserDetails/UserDetails';

const Documents = ({ id }: UserDetailsProps) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState('');

  const { documentsQuery } = useUsers();
  const { data, isLoading } = documentsQuery(id, {
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

  const columns = [
    { key: 'type', header: 'Document Type' },
    { key: 'status', header: 'Status' },
    {
      key: 'publicUrl',
      header: 'Document',
      render: (row: any) =>
        row.publicUrl ? (
          <a
            href={row.publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View
          </a>
        ) : (
          <span className="text-gray-400">N/A</span>
        ),
    },
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