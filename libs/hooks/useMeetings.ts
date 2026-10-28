
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from './usetoast';
import { ProjectService } from '../services/ProjectServices';
import { MeetingService } from '../services/MeetingService';



export const useMeetings = () => {
  const router = useRouter();
const { toast } = useToast();
  
 
const getMeetingsQuery = ( params: object) => {
  return useQuery({
    queryKey: ['meetings',  params], 
    queryFn: () => MeetingService.getMeetings(params),
  });
};

   const getMilestoneDetailsQuery = (id :any, milestoneId: any) => {
    return useQuery({
      queryKey: ['getMilestones', id], 
      queryFn: () => ProjectService.getMilestonesDetails(id, milestoneId ),
    });
  };

  

  return { 
  getMeetingsQuery
   };
};