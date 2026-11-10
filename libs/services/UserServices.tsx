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

export const UserService = {
getallusers: (params :any): Promise<AxiosResponse<any>> => 
    axiosInstance.get(`${APIURLS.DASHBOARD.USERS}/`, { params }),   
getSingleUser: (id: any): Promise<AxiosResponse<any>> => 
    axiosInstance.get(`${APIURLS.DASHBOARD.USERS}/${id}`),
updateUserStatus: (id: string, data: any): Promise<AxiosResponse<any>> =>
    axiosInstance.patch(`${APIURLS.DASHBOARD.USERS}/${id}/status`, data),
getBids: (id: any, params: any): Promise<AxiosResponse<any>> => 
    axiosInstance.get(`${APIURLS.DASHBOARD.USERS}/${id}/bids`, {params}),
getBidDetail: (id: string, bidId: string): Promise<any> =>
    axiosInstance.get(`${APIURLS.DASHBOARD.USERS}/${id}/bids/${bidId}`),
getActivity: (id: any, params: any): Promise<AxiosResponse<any>> => 
    axiosInstance.get(`${APIURLS.DASHBOARD.USERS}/${id}/activity`, {params}),
 getProjects: (id: any, params: any): Promise<AxiosResponse<any>> => 
    axiosInstance.get(`${APIURLS.DASHBOARD.USERS}/${id}/projects`, {params}),
 getDocuments: (id: any, params: any): Promise<AxiosResponse<any>> => 
    axiosInstance.get(`${APIURLS.DASHBOARD.USERS}/${id}/documents`, {params}),
createClients: (id: any): Promise<AxiosResponse<any>> => 
    axiosInstance.get(`${APIURLS.DASHBOARD.USERS}/clients`),
createBuilders: (id: any): Promise<AxiosResponse<any>> => 
    axiosInstance.get(`${APIURLS.DASHBOARD.USERS}/builders`),
getAllAccountDeletions: ( params: any): Promise<AxiosResponse<any>> => 
    axiosInstance.get(`${APIURLS.DASHBOARD.DELETE_REQUESTS}`, {params}),
deleteAccount: (id: any, data: any): Promise<AxiosResponse<any>> => 
    axiosInstance.patch(`${APIURLS.DASHBOARD.DELETE_REQUESTS}/${id}/resolve`, data),
createAdmin: (data: any): Promise<AxiosResponse<any>> =>
    axiosInstance.post(`${APIURLS.DASHBOARD.ADMIN}/`, data),
  getAdmin: (params: any): Promise<any> =>
    axiosInstance.get(`${APIURLS.DASHBOARD.ADMIN}/`, {params}),
  getAdminById: (id: string): Promise<any> =>
    axiosInstance.get(`${APIURLS.DASHBOARD.ADMIN}/${id}`),
  updateAdmin: (id: string, data: any): Promise<any> =>
    axiosInstance.patch(`${APIURLS.DASHBOARD.ADMIN}/${id}`, data),
  deleteAdmin: (id: string): Promise<any> =>
    axiosInstance.delete(`${APIURLS.DASHBOARD.ADMIN}/${id}`),
  activateAdmin: (id: string): Promise<AxiosResponse<any>> =>
    axiosInstance.patch(`${APIURLS.DASHBOARD.ADMIN}/${id}/activate`),
  deactivateAdmin: (id: string): Promise<AxiosResponse<any>> =>
    axiosInstance.patch(`${APIURLS.DASHBOARD.ADMIN}/${id}/deactivate`),
  resendInvite: (id: string): Promise<AxiosResponse<any>> =>
    axiosInstance.post(`${APIURLS.DASHBOARD.ADMIN}/${id}/resend-invite`),
};

