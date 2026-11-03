import { APIURLS } from "../constants/apiurl";
import axiosInstance from "../utils/axios";


export const PropertyService = {
  getProperties: (params:any) => axiosInstance.get(`${APIURLS.DASHBOARD.PROPERTY}/`, {params}),
  singleProperties: (propertyId: any) => axiosInstance.get(`${APIURLS.DASHBOARD.PROPERTY}/${propertyId}`),
  updatePropertyStatus: (data: any) => axiosInstance.patch(`${APIURLS.DASHBOARD.PROPERTY}/${data.propertyId}/status`, data),

};