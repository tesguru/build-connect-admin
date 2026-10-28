import { DataTable } from "@/components/ui/Datatable";
import { Eye, Download, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useDocuments } from "@/libs/hooks/useDocuments"; // update to your actual hook

const COLUMNS = [
  {
    key: "name",
    header: "Document Name",
    render: (row: any) => <span className="text-gray-900 font-medium">{row.name}</span>,
  },
  {
    key: "type",
    header: "Type",
    render: (row: any) => <span className="text-gray-700">{row.type}</span>,
  },
  {
    key: "uploadDate",
    header: "Upload Date",
    render: (row: any) => <span className="text-gray-700">{row.uploadDate}</span>,
  },
  {
    key: "status",
    header: "Status",
    render: (row: any) => (
      <span className={`px-3 py-1 rounded-md text-sm font-medium ${
        row.status === "approved"
          ? "bg-green-50 text-green-600"
          : row.status === "rejected"
          ? "bg-red-50 text-red-600"
          : "bg-yellow-50 text-yellow-600"
      }`}>
        {row.status?.charAt(0).toUpperCase() + row.status?.slice(1)}
      </span>
    ),
  },
  {
    key: "size",
    header: "Size",
    render: (row: any) => <span className="text-gray-700">{row.size}</span>,
  },
];

export default function DocumentReviewTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState('');

  const { getDocumentsQuery } = useDocuments();
  const { data, isLoading, error } = getDocumentsQuery({
    page,
    limit,
    search: search || undefined,
  });

  // API shape: { data: [...], meta: { totalDocuments, totalPage, page, count } }
  const rawData = data?.data?.data || [];
  const totalCount: number = data?.data?.meta?.totalDocuments ?? rawData.length;


  const tableData = useMemo(
    () =>
      rawData.map((doc: any) => ({
        id: doc.id,
        name: doc.originalName,
        type: doc.type,
        uploadDate: doc.createdAt
          ? new Date(doc.createdAt).toLocaleDateString()
          : "N/A",
        status: doc.status,
        size: doc.fileSize ? `${(doc.fileSize / (1024 * 1024)).toFixed(1)} MB` : "N/A",
        publicUrl: doc.publicUrl,
      })),
    [rawData],
  );

  const actions = useMemo(
    () => [
      {
        label: "View",
        icon: <Eye className="w-4 h-4 text-gray-600" />,
        onClick: (row: any) => window.open(row.publicUrl, "_blank"),
      },
      {
        label: "Download",
        icon: <Download className="w-4 h-4 text-blue-600" />,
        onClick: (row: any) => {
          const a = document.createElement("a");
          a.href = row.publicUrl;
          a.download = row.name;
          a.click();
        },
      },
      {
        label: "Delete",
        icon: <Trash2 className="w-4 h-4 text-red-600" />,
        onClick: (row: any) => {
          if (confirm(`Delete document: ${row.name}?`)) {
            // call your delete mutation here
          }
        },
      },
    ],
    [],
  );

 

  return (
    <div className="max-w-7xl mx-auto">
      <DataTable
        columns={COLUMNS}
        data={tableData}
        actions={actions}
        rowsPerPageOptions={[5, 8, 10, 20]}
        defaultRowsPerPage={limit}
        showSearch={true}
        searchPlaceholder="Search documents..."
        searchableColumns={["name", "type", "status"]}
        showSerialNumber={true}
        isLoading={isLoading}
     
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