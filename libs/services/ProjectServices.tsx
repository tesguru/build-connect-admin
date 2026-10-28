import { APIURLS } from "../constants/apiurl";
import axiosInstance from "../utils/axios.ts";


interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'builder';
  status: 'verified' | 'pending' | 'rejected';
  phone?: string;
  createdAt: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const ProjectService = {
getAllProjects: (params :any): Promise<PaginatedResponse<User>> => 
    axiosInstance.get(`${APIURLS.DASHBOARD.PROJECTS}/`, { params }),   
getSingleProject: (id: any): Promise<User> => 
    axiosInstance.get(`${APIURLS.DASHBOARD.PROJECTS}/${id}`),
getMilestones: (id: any, params?: any) => 
    axiosInstance.get(`${APIURLS.DASHBOARD.PROJECTS}/milestones/${id}/milestones`, { params }),
getDocuments: (id: any, params?: any) => 
    axiosInstance.get(`${APIURLS.DASHBOARD.PROJECTS}/documents/${id}/documents`, { params }),
getMeetings: (id: any, params?: any) => 
    axiosInstance.get(`${APIURLS.DASHBOARD.PROJECTS}/meetings/${id}/meetings`, { params }),
getMilestonesDetails: (id: any, mileStoneId: any): Promise<User> => 
    axiosInstance.get(`${APIURLS.DASHBOARD.PROJECTS}/milestones/${id}/milestones/${mileStoneId}`),
createMilestones: (data: { projectId: string; milestoneData: any }): Promise<any> => 
  axiosInstance.post(
    `${APIURLS.DASHBOARD.PROJECTS}/milestones/${data.projectId}/milestones`,
    data.milestoneData
  ),
  createDocuments: (data: { projectId: string; milestoneData: any }): Promise<any> => 
  axiosInstance.post(
    `${APIURLS.DASHBOARD.PROJECTS}/documents/${data.projectId}/documents`,
    data.milestoneData
  ),
   createMeeting: (data: { projectId: string; meetingData: any }): Promise<any> => 
  axiosInstance.post(
    `${APIURLS.DASHBOARD.PROJECTS}/meetings/${data.projectId}/meetings`,
    data.meetingData
  ),
};

