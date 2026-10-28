import { ArrowLeft, User, Building2, Calendar } from "lucide-react";
import { NairaIcon } from "@/components/ui/Custom/NairaIcon";
import { PageLoader } from "@/components/ui/Custom/LoadingState";
import DashboardLayout from "../DashboardLayout/DashboardLayout";
import { URLS } from "@/libs/constants/pageurl";
import { ProgressBar } from "@/components/ui/Custom/ProgressBar";
import Otherdetails from "./Others/Otherdetails";
import BackButton from "@/components/ui/BackButton";
import { InfoGrid, InfoItem } from "@/components/ui/Custom/Infogrid";
import { useProjects } from "@/libs/hooks/useProjects";
import { UserDetailsProps } from "../UserDetails/UserDetails";

const ProjectDetails = ({ id }: UserDetailsProps) => {
  const { singleProjectQuery } = useProjects();
  const { data, isLoading, error } = singleProjectQuery(id);
  const project = data?.data?.data;

  // Show loading state
  if (isLoading) {
    return (
      <DashboardLayout urlpath={URLS.DASHBOARD.PROJECTS}>
        <div className="bg-gray-50 min-h-screen">
          <div className="p-4">
            <BackButton label="Back" />
            <PageLoader label="Loading project details..." />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <DashboardLayout urlpath={URLS.DASHBOARD.PROJECTS}>
        <div className="bg-gray-50 min-h-screen">
          <div className="p-4">
            <BackButton label="Back" />
            <div className="mt-4 p-8 text-center text-sm text-gray-500">
              No data available
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show not found state
  if (!project) {
    return (
      <DashboardLayout urlpath={URLS.DASHBOARD.PROJECTS}>
        <div className="bg-gray-50 min-h-screen">
          <div className="p-4">
            <BackButton label="Back" />
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-600">Project not found.</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Now we can safely use project data
  const projectInfo: InfoItem[] = [
    {
      icon: User,
      label: 'Client',
      value: project?.client?.name ?? "Not specified"
    },
    {
      icon: Building2,
      label: 'Builder',
      value: project?.builder?.name ?? "Abc Constructions"
    },
    {
      icon: NairaIcon,
      label: 'Budget',
      value: project?.budgetAmount ? `₦${Number(project.budgetAmount).toLocaleString()}` : "₦0"
    },
  ];

  return (
    <DashboardLayout urlpath={URLS.DASHBOARD.PROJECTS}>
      <div className="bg-gray-50 min-h-screen">
        <div className="p-4">
          <BackButton label="Back" />
          <div className="p-4">
            <div className="flex justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {project?.title}
                  </h1>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-md">
                    {project?.status}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <ProgressBar progress={project?.progress ?? 0} label="Foundation" />
              </div>
            </div>

            <InfoGrid items={projectInfo} />
          </div>
          <Otherdetails project={project}  />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetails;