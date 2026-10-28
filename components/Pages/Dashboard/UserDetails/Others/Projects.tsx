import { DataTable } from "@/components/ui/Datatable";
import { SectionLoader } from "@/components/ui/Custom/LoadingState";
import { useUsers } from "@/libs/hooks/useUsers";
import { useState } from "react";

interface ProjectsProps {
  id: string;
}

interface Project {
  id: string;
  title: string;
  status: "draft" | "active" | "completed" | "cancelled";
  createdAt: string;
  budgetRangeId: string;
  budgetRangeLabel: string;
  budgetMin: number;
  budgetMax: number;
  projectTypeId: string;
  location: string;
  startDate: string;
  endDate: string;
}

export default function Projects({ id }: ProjectsProps) {
  const { projectsQuery } = useUsers();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState('');

  const { data, isLoading } = projectsQuery(id, {
    page,
    limit,
    search: search || undefined,
  });


  const clientProjects = data?.data?.data?.map((project: Project) => ({
    id: project.id,
    projectName: project.title,
    // budget: project.budgetRangeLabel || `$${project.budgetMin.toLocaleString()} - $${project.budgetMax.toLocaleString()}`,
    location: project.location,
    startDate: new Date(project.startDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    status: project.status.charAt(0).toUpperCase() + project.status.slice(1), // Capitalize status
    budgetMin: project.budgetMin,
    budgetMax: project.budgetMax,
    createdAt: project.createdAt
  })) || [];

  const totalCount: number = data?.data?.meta?.totalDocuments ?? clientProjects.length;

 

  const columns = [
    { 
      key: "projectName", 
      header: "Project Name", 
      render: (row: any) => <span className="font-medium">{row.projectName}</span> 
    },
    // { 
    //   key: "budget", 
    //   header: "Budget", 
    //   render: (row: any) => (
    //     <span className="font-semibold text-gray-700">
    //       {row.budget}
    //     </span>
    //   ) 
    // },
    { 
      key: "location", 
      header: "Location", 
      render: (row: any) => <span className="text-gray-600">{row.location}</span> 
    },
    { 
      key: "startDate", 
      header: "Start Date", 
      render: (row: any) => <span className="text-gray-600">{row.startDate}</span> 
    },
    {
      key: "status", 
      header: "Status", 
      render: (row: any) => (
        <span className={`px-3 py-1 rounded-md text-sm font-medium ${
          row.status.toLowerCase() === "completed" ? "bg-green-100 text-green-700"
          : row.status.toLowerCase() === "active" ? "bg-blue-100 text-blue-700"
          : row.status.toLowerCase() === "draft" ? "bg-yellow-100 text-yellow-700"
          : "bg-gray-100 text-gray-700"
        }`}>
          {row.status}
        </span>
      )
    },
  ];

  if (isLoading) {
    return (
      <div className="bg-gray-50 p-6">
        <p className="text-2xl font-bold mb-4">Client Projects</p>
        <SectionLoader label="Loading projects..." />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6">
      <div>
        <p className="text-2xl font-bold mb-4">
          Client Projects
        </p>
      </div>
 
      <div className="max-w-7xl mx-auto">
        <DataTable
          columns={columns}
          data={clientProjects}
          rowsPerPageOptions={[5, 8, 10, 20]}
          defaultRowsPerPage={limit}
          showSearch={true}
          searchPlaceholder="Search projects..."
          searchableColumns={["projectName", "location"]}
          showSerialNumber={true}
          isLoading={isLoading}
          emptyMessage="No projects found"
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
    </div>
  );
}