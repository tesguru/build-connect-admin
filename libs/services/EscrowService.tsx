import { APIURLS } from "../constants/apiurl";
import axiosInstance from "../utils/axios";


export const EscrowService = {
  getPaymentInstructions: (params:any) => axiosInstance.get(`${APIURLS.DASHBOARD.ESCROW}/payment-instructions`, {params}),
  getWalletFunding: (params: any) => axiosInstance.get(`${APIURLS.DASHBOARD.ESCROW}/wallet-fundings`, {params}),
  updatePaymentInstructions: (data: any) => axiosInstance.patch(`${APIURLS.DASHBOARD.ESCROW}/payment-instructions/${data.instructionId}/status`, data),
  updateWalletFunding: (data: any) => axiosInstance.patch(`${APIURLS.DASHBOARD.ESCROW}/wallet-fundings/${data.fundingId}/status`, data),
};