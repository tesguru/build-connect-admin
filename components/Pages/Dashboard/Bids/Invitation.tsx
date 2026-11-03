import { DataTable } from "@/components/ui/Datatable";
import { useBid } from "@/libs/hooks/useBid";
import { useMemo } from "react";
import { cleanName } from "@/libs/utils/helpers";

const COLUMNS = [
  {
    key: "project",
    header: "Project",
    render: (row: any) => <span>{row.project}</span>,
  },
  {
    key: "builderInvited",
    header: "Builder Invited",
    render: (row: any) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.builderName}</span>
        <span className="text-xs text-gray-400">{row.builderEmail}</span>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (row: any) => (
      <span
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          row.status === "accepted"
            ? "bg-green-100 text-green-700"
            : row.status === "rejected"
            ? "bg-red-100 text-red-700"
            : "bg-yellow-100 text-yellow-700" // pending
        }`}
      >
        {row.status?.charAt(0).toUpperCase() + row.status?.slice(1)}
      </span>
    ),
  },
  {
    key: "invitationDate",
    header: "Invitation Date",
    render: (row: any) => (
      <span>
        {row.invitationDate
          ? new Date(row.invitationDate).toLocaleDateString()
          : "N/A"}
      </span>
    ),
  },
  {
    key: "deadlineDate",
    header: "Deadline Date",
    render: (row: any) => (
      <span>
        {row.deadlineDate
          ? new Date(row.deadlineDate).toLocaleDateString()
          : "N/A"}
      </span>
    ),
  },
];

export default function Invitation() {
  const { bidInvitationQuery } = useBid();
  // This endpoint has no `search` param, so filtering happens client-side over one fetch.
  const { data, isLoading } = bidInvitationQuery({ limit: 100 });

  const rawData   = data?.data?.data  || [];

  const tableData = useMemo(
    () =>
      rawData.map((item: any) => ({
        id:             item.id,
        project:        item.project?.title        || "N/A",
        builderName:    cleanName(item.builder?.name) || "N/A",
        builderEmail:   item.builder?.email        || "",
        status:         item.status,
        invitationDate: item.sentAt,
        deadlineDate:   item.expiresAt,
      })),
    [rawData],
  );

  return (
    <div className="bg-gray-50">
      <div>
        <p className="text-2xl font-bold">Bid Invitations</p>
        <p className="text-md">
          Manage invitations sent to builders for project bidding
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <DataTable
          columns={COLUMNS}
          data={tableData}
          rowsPerPageOptions={[5, 8, 10, 20]}
          defaultRowsPerPage={8}
          showSearch={true}
          searchPlaceholder="Search invitations..."
          searchableColumns={["project", "builderName", "status"]}
          showSerialNumber={true}
          isLoading={isLoading}
          emptyMessage="No invitations yet"
        />
      </div>
    </div>
  );
}