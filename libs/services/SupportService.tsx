import { APIURLS } from "../constants/apiurl";
import axiosInstance from "../utils/axios.ts";

export type SupportTicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type SupportTicketPriority = "low" | "medium" | "high";

export interface SupportTicketAttachment {
  id: string;
  fileId: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  publicUrl: string | null;
  createdAt: string;
}

export interface SupportTicketUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  projectName: string | null;
  user: SupportTicketUser | null;
  attachments: SupportTicketAttachment[];
  createdAt: string;
  updatedAt: string;
}

const ticketsUrl = (ticketId?: string) =>
  `${APIURLS.DASHBOARD.SUPPORT.SUPPORT}/tickets${ticketId ? `/${ticketId}` : ""}`;

export const SupportService = {
  getTickets: (params?: any) => axiosInstance.get(ticketsUrl(), { params }),
  getTicketById: (ticketId: string) => axiosInstance.get(ticketsUrl(ticketId)),
  createTickets: (data: any) => axiosInstance.post(ticketsUrl(), data),
  updateTicketStatus: (ticketId: string, status: SupportTicketStatus) =>
    axiosInstance.patch(`${ticketsUrl(ticketId)}/status`, { status }),
  updateTicketPriority: (ticketId: string, priority: SupportTicketPriority) =>
    axiosInstance.patch(`${ticketsUrl(ticketId)}/priority`, { priority }),
};
