import { APIURLS } from "../constants/apiurl";
import axiosInstance from "../utils/axios";


export const MortgageService = {
  getMortgageApplications: (params:any) => axiosInstance.get(`${APIURLS.DASHBOARD.MORTGAGE}/`, {params}),
  singleMortgageApplications: (propertyId: any) => axiosInstance.get(`${APIURLS.DASHBOARD.MORTGAGE}/${propertyId}`),
  updateMortgageApplicationsDecision: (data: any) => axiosInstance.patch(`${APIURLS.DASHBOARD.MORTGAGE}/${data.applicationId}/decision`, data),
  updateMortgageApplicationStatus: (data: any) => axiosInstance.patch(`${APIURLS.DASHBOARD.MORTGAGE}/${data.applicationId}/status`, data),
};