import { DataTable } from "@/components/ui/Datatable";
import { SectionLoader } from "@/components/ui/Custom/LoadingState";
import { useUsers } from "@/libs/hooks/useUsers";
import { Eye, Download } from "lucide-react";
import MetricsCard from "@/components/ui/Custom/MetricsCard";
import { FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useState } from "react";

interface DocumentsProps {
  id: string;
}

interface Document {
  id: string;
  type: "profile_picture" | "id_card" | "license" | "certificate" | "contract" | "other";
  status: "pending" | "verified" | "rejected";
  createdAt: string;
  updatedAt: string;
  publicUrl: string;
}

export default function Documents({ id }: DocumentsProps) {
  const { documentsQuery } = useUsers();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState('');

  const { data, isLoading } = documentsQuery(id, {
    page,
    limit,
    search: search || undefined,
  });

  // Transform API data to match your table columns
  const clientDocuments = data?.data?.data?.map((document: Document) => ({
    id: document.id,
    documentName: getDocumentTypeLabel(document.type),
    type: document.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    status: document.status.charAt(0).toUpperCase() + document.status.slice(1),
    uploadDate: new Date(document.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    publicUrl: document.publicUrl,
    originalType: document.type
  })) || [];


  function getDocumentTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      profile_picture: "Profile Picture",
      id_card: "ID Card",
      license: "Professional License",
      certificate: "Certificate",
      contract: "Contract",
      other: "Other Document"
    };
    return labels[type] || type;
  }

  // Calculate metrics from the data
  const totalDocuments = data?.data?.meta?.totalDocuments || clientDocuments.length;
  const verifiedDocuments = clientDocuments.filter((doc: any) => doc.status === 'Verified').length;
  const pendingDocuments = clientDocuments.filter((doc: any) => doc.status === 'Pending').length;
  const rejectedDocuments = clientDocuments.filter((doc: any) => doc.status === 'Rejected').length;

  const columns = [
    { 
      key: "documentName", 
      header: "Document Name", 
      render: (row: any) => <span className="font-medium">{row.documentName}</span> 
    },
    { 
      key: "type", 
      header: "Type", 
      render: (row: any) => <span className="text-gray-600">{row.type}</span> 
    },
    {
      key: "status", 
      header: "Status", 
      render: (row: any) => (
        <span className={`px-3 py-1 rounded-md text-sm font-medium ${
          row.status === "Verified" ? "bg-green-100 text-green-700"
          : row.status === "Pending" ? "bg-yellow-100 text-yellow-700"
          : "bg-red-100 text-red-700"
        }`}>
          {row.status}
        </span>
      )
    },
    { 
      key: "uploadDate", 
      header: "Upload Date", 
      render: (row: any) => <span className="text-gray-600">{row.uploadDate}</span> 
    },
  ];

  const actions = [
    {
      label: "View",
      icon: <Eye className="w-4 h-4 text-blue-600" />,
      onClick: (row: any) => {
        if (row.publicUrl) {
          window.open(row.publicUrl, '_blank');
        } else {
          console.log("View document:", row);
        }
      }
    },
    {
      label: "Download",
      icon: <Download className="w-4 h-4 text-green-600" />,
      onClick: (row: any) => {
        if (row.publicUrl) {
          // Create a temporary link to download the file
          const link = document.createElement('a');
          link.href = row.publicUrl;
          link.download = `${row.documentName}.${getFileExtension(row.publicUrl)}`;
          link.click();
        } else {
          console.log("Download document:", row);
        }
      }
    },
  ];

  // Helper function to get file extension from URL
  function getFileExtension(url: string): string {
    return url.split('.').pop()?.toLowerCase() || 'file';
  }

  if (isLoading) {
    return (
      <div className="bg-gray-50 p-6">
        <p className="text-2xl font-bold mb-4">Client Documents</p>
        <SectionLoader label="Loading documents..." />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6">
      <div>
        <p className="text-2xl font-bold mb-4">
          Client Documents
        </p>
      </div>

    

      <div className="max-w-7xl mx-auto">
        <DataTable
          columns={columns}
          data={clientDocuments}
          actions={actions}
          rowsPerPageOptions={[5, 8, 10, 20]}
          defaultRowsPerPage={limit}
          showSearch={true}
          searchPlaceholder="Search documents..."
          searchableColumns={["documentName", "type"]}
          showSerialNumber={true}
          isLoading={isLoading}
          emptyMessage="No documents found"
          serverSide={true}
          totalCount={totalDocuments}
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
    </div>
  );
}