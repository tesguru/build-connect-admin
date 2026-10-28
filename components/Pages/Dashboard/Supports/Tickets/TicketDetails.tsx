"use client";

import { useEffect, useMemo, useState } from "react";
import {
  User,
  Mail,
  Phone,
  FolderKanban,
  Calendar,
  Clock,
  Paperclip,
  Download,
} from "lucide-react";
import DashboardLayout from "../../DashboardLayout/DashboardLayout";
import { URLS } from "@/libs/constants/pageurl";
import BackButton from "@/components/ui/BackButton";
import { InfoGrid, InfoItem } from "@/components/ui/Custom/Infogrid";
import { PageLoader, Spinner } from "@/components/ui/Custom/LoadingState";
import { useSupport } from "@/libs/hooks/useSupport";
import { formatName } from "@/libs/utils/helpers";
import type {
  SupportTicket,
  SupportTicketPriority,
  SupportTicketStatus,
} from "@/libs/services/SupportService";

const STATUS_OPTIONS: { value: SupportTicketStatus; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

const PRIORITY_OPTIONS: { value: SupportTicketPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const statusStyles: Record<SupportTicketStatus, string> = {
  open: "bg-yellow-100 text-yellow-700",
  in_progress: "bg-blue-100 text-blue-700",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-700",
};

const priorityStyles: Record<SupportTicketPriority, string> = {
  low: "bg-blue-50 text-blue-600",
  medium: "bg-orange-50 text-orange-600",
  high: "bg-red-50 text-red-600",
};

const formatFileSize = (bytes: number) => {
  if (!bytes) return "0 KB";
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
};

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

interface TicketDetailsProps {
  id: string;
}

const TicketDetails = ({ id }: TicketDetailsProps) => {
  const { getTicketQuery, updateTicketStatusMutation, updateTicketPriorityMutation } =
    useSupport();
  const { data, isLoading, isError } = getTicketQuery(id);

  const ticket = data?.data?.data as SupportTicket | undefined;

  const [status, setStatus] = useState<SupportTicketStatus>("open");
  const [priority, setPriority] = useState<SupportTicketPriority>("medium");

  useEffect(() => {
    if (!ticket) return;
    setStatus(ticket.status);
    setPriority(ticket.priority);
  }, [ticket]);

  const infoItems: InfoItem[] = useMemo(
    () => [
      {
        icon: User,
        label: "Requester",
        value:
          formatName(ticket?.user?.firstName, ticket?.user?.lastName) ||
          ticket?.user?.email ||
          "Not specified",
      },
      {
        icon: Mail,
        label: "Email",
        value: ticket?.user?.email || "Not specified",
      },
      {
        icon: Phone,
        label: "Phone Number",
        value: ticket?.user?.phoneNumber || "Not specified",
      },
      {
        icon: FolderKanban,
        label: "Project",
        value: ticket?.projectName || "N/A",
      },
      {
        icon: Calendar,
        label: "Created",
        value: formatDate(ticket?.createdAt),
      },
      {
        icon: Clock,
        label: "Last Updated",
        value: formatDate(ticket?.updatedAt),
      },
    ],
    [ticket],
  );

  if (isLoading) {
    return (
      <DashboardLayout urlpath={URLS.DASHBOARD.SUPPORT}>
        <div className="bg-gray-50 min-h-screen p-4">
          <BackButton label="Back" />
          <PageLoader label="Loading ticket..." />
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !ticket) {
    return (
      <DashboardLayout urlpath={URLS.DASHBOARD.SUPPORT}>
        <div className="bg-gray-50 min-h-screen p-4">
          <BackButton label="Back" />
          <div className="p-8 text-center text-sm text-gray-500">
            No data available
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const statusChanged = status !== ticket.status;
  const priorityChanged = priority !== ticket.priority;

  return (
    <DashboardLayout urlpath={URLS.DASHBOARD.SUPPORT}>
      <div className="bg-gray-50 min-h-screen">
        <div className="p-4">
          <BackButton label="Back" />

          <div className="p-4">
            <div className="mb-6">
              <p className="font-mono text-sm font-semibold text-gray-500 mb-1">
                {ticket.ticketNumber}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {ticket.subject}
                </h1>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    statusStyles[ticket.status] ?? "bg-gray-100 text-gray-700"
                  }`}
                >
                  {STATUS_OPTIONS.find((opt) => opt.value === ticket.status)?.label ??
                    ticket.status}
                </span>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    priorityStyles[ticket.priority] ?? "bg-gray-100 text-gray-700"
                  }`}
                >
                  {PRIORITY_OPTIONS.find((opt) => opt.value === ticket.priority)
                    ?.label ?? ticket.priority}
                </span>
              </div>
            </div>

            <InfoGrid items={infoItems} />
          </div>

          <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-3">
                  Description
                </h2>
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {ticket.description || "No description provided."}
                </p>
              </div>

              {ticket.attachments?.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h2 className="text-sm font-semibold text-gray-900 mb-2">
                    Attachments ({ticket.attachments.length})
                  </h2>
                  <ul className="divide-y divide-gray-100">
                    {ticket.attachments.map((attachment) => (
                      <li
                        key={attachment.id}
                        className="flex items-center justify-between gap-4 py-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                            <Paperclip className="w-4 h-4 text-gray-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {attachment.originalName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {attachment.mimeType} · {formatFileSize(attachment.fileSize)}
                            </p>
                          </div>
                        </div>
                        {attachment.publicUrl && (
                          <a
                            href={attachment.publicUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 shrink-0"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 h-fit">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">
                Manage Ticket
              </h2>

              <label
                htmlFor="ticket-status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <div className="flex gap-2 mb-5">
                <select
                  id="ticket-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as SupportTicketStatus)}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() =>
                    updateTicketStatusMutation.mutate({ ticketId: ticket.id, status })
                  }
                  disabled={!statusChanged || updateTicketStatusMutation.isPending}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateTicketStatusMutation.isPending && (
                    <Spinner className="h-4 w-4" />
                  )}
                  Update
                </button>
              </div>

              <label
                htmlFor="ticket-priority"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Priority
              </label>
              <div className="flex gap-2">
                <select
                  id="ticket-priority"
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value as SupportTicketPriority)
                  }
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {PRIORITY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() =>
                    updateTicketPriorityMutation.mutate({
                      ticketId: ticket.id,
                      priority,
                    })
                  }
                  disabled={!priorityChanged || updateTicketPriorityMutation.isPending}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateTicketPriorityMutation.isPending && (
                    <Spinner className="h-4 w-4" />
                  )}
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TicketDetails;
