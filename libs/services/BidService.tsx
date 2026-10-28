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

export const BidService = {

  expressionInterest: (params?: any) => 
    axiosInstance.get(`${APIURLS.DASHBOARD.BIDS}/expressions-of-interest`, { params }),
    bidInvitations: (params?: any) => 
    axiosInstance.get(`${APIURLS.DASHBOARD.BIDS}/invitations`, { params }),
    submittedBids: (params?: any) => 
    axiosInstance.get(`${APIURLS.DASHBOARD.BIDS}/submitted`, { params }),
};

