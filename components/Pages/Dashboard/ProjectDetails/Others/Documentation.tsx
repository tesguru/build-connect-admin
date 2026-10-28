import { DataTable } from "@/components/ui/Datatable";
import { SectionLoader } from "@/components/ui/Custom/LoadingState";
import { Eye, Download, FileText, Image, File, PlusIcon } from "lucide-react";
import { useProjects } from "@/libs/hooks/useProjects";
import { UserDetailsProps } from "../../UserDetails/UserDetails";
import ActionButton from "@/components/ui/Button/ActionButton";
import { useState } from "react";


export default function Documentation({ project }: any) {
  const { getDocuments } = useProjects(); 
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState('');

  const { data, isLoading } = getDocuments(project?.id, {
    page,
    limit,
    search: search || undefined,
  });

  const documents = data?.data?.data || [];
  const totalCount: number = data?.data?.meta?.totalDocuments ?? documents.length;

  console.log(project);
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'profile_picture':
        return <Image className="w-5 h-5 text-blue-600" />;
      case 'document':
        return <FileText className="w-5 h-5 text-green-600" />;
      default:
        return <File className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            Approved
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
            Pending
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
            {status}
          </span>
        );
    }
  };

  const columns = [
    {
      key: "type",
      header: "Type",
      render: (row: any) => (
        <div className="flex items-center gap-2">
          {getFileIcon(row.type)}
          <span className="capitalize">
            {row.type?.replace('_', ' ')}
          </span>
        </div>
      )
    },
    {
      key: "fileName",
      header: "File Name",
      render: (row: any) => (
        <span className="font-medium text-gray-900">{row.fileName}</span>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (row: any) => getStatusBadge(row.status)
    },
    {
      key: "createdAt",
      header: "Uploaded",
      render: (row: any) => (
        <span className="text-gray-600">{formatDate(row.createdAt)}</span>
      )
    }
  ];

  const actions = [
    {
      label: "View",
      icon: <Eye className="w-4 h-4 text-gray-600" />,
      onClick: (row: any) => {
        if (row.publicUrl) {
          window.open(row.publicUrl, '_blank');
        }
      }
    },
    {
      label: "Download",
      icon: <Download className="w-4 h-4 text-gray-600" />,
      onClick: (row: any) => {
        if (row.publicUrl) {
          const link = document.createElement('a');
          link.href = row.publicUrl;
          link.download = row.fileName || 'document';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    }
  ];

  if (isLoading) {
    return (
      <div className="p-6">
      
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Documentation</h1>
           <ActionButton
              label="Add Milestone"
              icon={<PlusIcon />}
              href={`/create-documents/${project.id}`}
            />
        </div>
        <SectionLoader label="Loading documents..." />
      </div>
    );
  }

  if (totalCount === 0 && !search) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Documentation</h1>
        </div>
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No documents found</p>
          <p className="text-sm text-gray-400">Upload project documents to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-end mb-3">
       <ActionButton
              label="Add Dcouments"
              icon={<PlusIcon />}
              href={`/create-documents/${project?.id}`}
            />
            </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Documentation</h1>
        <span className="text-sm text-gray-500">
          {totalCount} document{totalCount !== 1 ? 's' : ''}
        </span>
      </div>

      <DataTable
        columns={columns}
        data={documents}
        actions={actions}
        showSearch={true}
        searchPlaceholder="Search documents..."
        searchableColumns={['fileName', 'type', 'status']}
        showSerialNumber={true}
        isLoading={isLoading}
        emptyMessage="No documents found"
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
    </div>
  );
}