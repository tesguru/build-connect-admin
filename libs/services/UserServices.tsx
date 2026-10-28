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

export const UserService = {
getallusers: (params :any): Promise<PaginatedResponse<User>> => 
    axiosInstance.get(`${APIURLS.DASHBOARD.USERS}/`, { params }),   
getSingleUser: (id: any): Promise<User> => 
    axiosInstance.get(`${APIURLS.DASHBOARD.USERS}/${id}`),
getBids: (id: any, params: any): Promise<User> => 
    axiosInstance.get(`${APIURLS.DASHBOARD.USERS}/${id}/bids`, {params}),
getBidDetail: (id: string, bidId: string): Promise<any> =>
    axiosInstance.get(`${APIURLS.DASHBOARD.USERS}/${id}/bids/${bidId}`),
getActivity: (id: any, params: any): Promise<User> => 
    axiosInstance.get(`${APIURLS.DASHBOARD.USERS}/${id}/activity`, {params}),
 getProjects: (id: any, params: any): Promise<User> => 
    axiosInstance.get(`${APIURLS.DASHBOARD.USERS}/${id}/projects`, {params}),
 getDocuments: (id: any, params: any): Promise<User> => 
    axiosInstance.get(`${APIURLS.DASHBOARD.USERS}/${id}/documents`, {params}),
createClients: (id: any): Promise<User> => 
    axiosInstance.get(`${APIURLS.DASHBOARD.USERS}/clients`),
createBuilders: (id: any): Promise<User> => 
    axiosInstance.get(`${APIURLS.DASHBOARD.USERS}/builders`),
getAllAccountDeletions: ( params: any): Promise<User> => 
    axiosInstance.get(`${APIURLS.DASHBOARD.DELETE_REQUESTS}`, {params}),
deleteAccount: (id: any, data: any): Promise<User> => 
    axiosInstance.patch(`${APIURLS.DASHBOARD.DELETE_REQUESTS}/${id}/resolve`, data),
createAdmin: (data: any): Promise<User> =>
    axiosInstance.post(`${APIURLS.DASHBOARD.ADMIN}/`, data),
  getAdmin: (params: any): Promise<User> =>
    axiosInstance.get(`${APIURLS.DASHBOARD.ADMIN}/`, {params}),
};

