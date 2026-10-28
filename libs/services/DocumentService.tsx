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

export const DocumentService = {

   getDocuments: (params?: { page?: number; limit?: number; search?: string }) => 
    axiosInstance.get(`${APIURLS.DASHBOARD.DOCUMENTS}/`, { params }),
    createDocuments: (data: any) => 
    axiosInstance.post(`${APIURLS.DASHBOARD.DOCUMENTS}/`, data),
};