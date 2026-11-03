import { APIURLS } from "../constants/apiurl";
import axiosInstance from "../utils/axios";


export interface PrepareUploadData {
  fileName: string;
  fileSize: number;
  mimeType: string;
  type: string;
  width?: number;
  height?: number;
  description?: string;
}

export interface ConfirmUploadData {
  cloudinaryPublicId: string;
  cloudinarySecureUrl: string;
  actualFileSize: number;
}

export const UploadService = {
  prepareUpload: (data: PrepareUploadData) =>
    axiosInstance.post(APIURLS.DASHBOARD.UPLOAD.PREPARE_UPLOAD, data),
  
  confirmUpload: (fileId: string, data: ConfirmUploadData) =>
    axiosInstance.post(APIURLS.DASHBOARD.UPLOAD.CONFIRM_UPLOAD(fileId), data),
};

