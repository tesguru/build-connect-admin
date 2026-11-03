import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from './usetoast';
import { SupportService } from '../services/SupportService';
import { DashboardService } from '../services/DashboardServices';



export const useDashboard = () => {
  const router = useRouter();
const { toast } = useToast();
  
 
const getAnalyticsQuery = () => {
  return useQuery({
    queryKey: ['getAnalytics',  ], 
    queryFn: () => DashboardService.getAnalytics(),
  });
 };
const getRecentActivity = (params?: object) => {
  return useQuery({
    queryKey: ['getRecentActivity', params],
    queryFn: () => DashboardService.getRecentActivity(params),
  })
 };

  return { 
   getAnalyticsQuery,
   getRecentActivity

}
}