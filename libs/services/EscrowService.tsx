import { APIURLS } from "../constants/apiurl";
import axiosInstance from "../utils/axios";

export interface EscrowStatusUpdate {
  status: string;
  statusUpdateNote?: string;
}

const statusBody = ({ status, statusUpdateNote }: EscrowStatusUpdate) =>
  statusUpdateNote?.trim() ? { status, statusUpdateNote: statusUpdateNote.trim() } : { status };

export const EscrowService = {
  getPaymentInstructions: (params: any) => axiosInstance.get(`${APIURLS.DASHBOARD.ESCROW}/payment-instructions`, { params }),
  getPaymentInstructionById: (id: string) => axiosInstance.get(`${APIURLS.DASHBOARD.ESCROW}/payment-instructions/${id}`),
  getWalletFunding: (params: any) => axiosInstance.get(`${APIURLS.DASHBOARD.ESCROW}/wallet-fundings`, { params }),
  getWalletFundingById: (id: string) => axiosInstance.get(`${APIURLS.DASHBOARD.ESCROW}/wallet-fundings/${id}`),
  updatePaymentInstructions: ({ instructionId, ...body }: EscrowStatusUpdate & { instructionId: string }) =>
    axiosInstance.patch(`${APIURLS.DASHBOARD.ESCROW}/payment-instructions/${instructionId}/status`, statusBody(body)),
  updateWalletFunding: ({ fundingId, ...body }: EscrowStatusUpdate & { fundingId: string }) =>
    axiosInstance.patch(`${APIURLS.DASHBOARD.ESCROW}/wallet-fundings/${fundingId}/status`, statusBody(body)),
};