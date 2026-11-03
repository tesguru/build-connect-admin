import { APIURLS } from "../constants/apiurl";
import type { AxiosResponse } from "axios";
import axiosInstance from "../utils/axios";


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

export const MeetingService = {

 getMeetings: (params: any): Promise<AxiosResponse<any>> => 
    axiosInstance.get(`${APIURLS.DASHBOARD.MEETINGS}/`, {params}),
   createMeeting: (data: { projectId: string; meetingData: any }): Promise<any> => 
  axiosInstance.post(
    `${APIURLS.DASHBOARD.PROJECTS}/meetings/${data.projectId}/meetings`,
    data.meetingData
  ),
};

