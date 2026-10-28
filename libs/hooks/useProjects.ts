import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from './usetoast';
import { ProjectService } from '../services/ProjectServices';



export const useProjects = () => {
  const router = useRouter();
const { toast } = useToast();
  
 
const projectsQuery = ( params: object) => {
  return useQuery({
    queryKey: ['projects',  params], 
    queryFn: () => ProjectService.getAllProjects(params),
  });
};

   const createProjectMutation = useMutation({
    mutationFn: ProjectService.createBuilders,
    onSuccess: (data) => {
      toast.success("Success", "Project created successfully");
    },
    onError: (error: any) => {
      toast.error("Error", "Failed to create client");
      console.error('Create client error:', error);
    }
  });

  const createMilestoneMutation = useMutation({
    mutationFn: ProjectService.createMilestones,
    onSuccess: (data) => {
      toast.success("Success", "Project created successfully");
    },
    onError: (error: any) => {
      toast.error("Error", "Failed to create client");
      console.error('Create client error:', error);
    }
  });

  const createDocuments = useMutation({
    mutationFn: ProjectService.createDocuments,
    onSuccess: (data) => {
      toast.success("Success", "Project created successfully");
    },
    onError: (error: any) => {
      toast.error("Error", "Failed to create client");
      console.error('Create client error:', error);
    }
  });

  const createMeetings = useMutation({
    mutationFn: ProjectService.createMeeting,
    onSuccess: (data) => {
      toast.success("Success", "Project created successfully");
    },
    onError: (error: any) => {
      toast.error("Error", "Failed to create client");
      console.error('Create client error:', error);
    }
  });

  

  const singleProjectQuery = (id :any) => {
    return useQuery({
      queryKey: ['singleProject', id], 
      queryFn: () => ProjectService.getSingleProject(id),
    });
  };

    const getMilestoneQuery = (id :any, params?: object) => {
    return useQuery({
      queryKey: ['projectMilestones', id, params], 
      queryFn: () => ProjectService.getMilestones(id, params),
    });
  };
   const getMilestoneDetailsQuery = (id :any, milestoneId: any) => {
    return useQuery({
      queryKey: ['milestoneDetails', id, milestoneId], 
      queryFn: () => ProjectService.getMilestonesDetails(id, milestoneId ),
    });
  };

  const getDocuments = (id :any, params?: object) => {
    return useQuery({
      queryKey: ['projectDocuments', id, params], 
      queryFn: () => ProjectService.getDocuments(id, params),
    });
  };

  const getMeetings = (id :any, params?: object) => {
    return useQuery({
      queryKey: ['projectMeetings', id, params], 
      queryFn: () => ProjectService.getMeetings(id, params),
    });
  };

  return { 
    projectsQuery,
    createProjectMutation,
    singleProjectQuery,
    getMilestoneQuery,
    createMilestoneMutation,
    createDocuments,
    createMeetings,
    getMeetings,
    getDocuments,
    getMilestoneDetailsQuery
   };
};