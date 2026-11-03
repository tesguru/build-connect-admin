import { DataTable } from "@/components/ui/Datatable";
import { useUsers } from "@/libs/hooks/useUsers";
import { formatName, formatStatus } from "@/libs/utils/helpers";
import { Eye, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createAdminSchema,
  updateAdminSchema,
  createAdminInput,
  updateAdminInput,
} from "@/libs/schema/authschema";
import InputField from "@/components/ui/Forms/InputField";
import Button from "@/components/ui/Button/Button";
import { PageLoader, Spinner } from "@/components/ui/Custom/LoadingState";

const roleStyles: Record<string, string> = {
  super_admin: "bg-blue-100 text-blue-700",
};

const verificationStyles: Record<string, string> = {
  verified: "bg-green-100 text-green-700",
  not_required: "bg-gray-100 text-gray-700",
};

const COLUMNS = [
  {
    key: "fullName",
    header: "Name",
    render: (row: any) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.fullName}</span>
        <span className="text-xs text-gray-500">{row.email}</span>
      </div>
    ),
  },
  {
    key: "phoneNumber",
    header: "Phone",
    render: (row: any) => <span>{row.phoneNumber || "N/A"}</span>,
  },
  {
    key: "location",
    header: "Location",
    render: (row: any) => <span>{row.location || "N/A"}</span>,
  },
  {
    key: "role",
    header: "Role",
    render: (row: any) => (
      <span
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          roleStyles[row.role] ?? "bg-gray-100 text-gray-700"
        }`}
      >
        {formatStatus(row.role) || "N/A"}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (row: any) => (
      <span
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          verificationStyles[row.verificationStatus] ?? "bg-gray-100 text-gray-700"
        }`}
      >
        {formatStatus(row.verificationStatus) || "N/A"}
      </span>
    ),
  },
  {
    key: "createdAt",
    header: "Created On",
    render: (row: any) => (
      <span>
        {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "N/A"}
      </span>
    ),
  },
];

const modalWrapper = "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4";
const modalCard =
  "bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto";
const modalClose = "absolute top-4 right-4 text-gray-400 hover:text-gray-600";

function AdminViewModal({ id, onClose }: { id: string; onClose: () => void }) {
  const { adminDetailQuery } = useUsers();
  const { data, isLoading, error } = adminDetailQuery(id);
  const admin = data?.data?.data;

  const items = admin
    ? [
        { label: "Full Name", value: formatName(admin.firstName, admin.lastName) || admin.fullName },
        { label: "Email", value: admin.email },
        { label: "Phone", value: admin.phoneNumber },
        { label: "Location", value: admin.location },
        { label: "Role", value: formatStatus(admin.role) },
        { label: "Status", value: formatStatus(admin.verificationStatus) },
        { label: "Email Verified", value: admin.isEmailVerified ? "Yes" : "No" },
        {
          label: "Created On",
          value: admin.createdAt ? new Date(admin.createdAt).toLocaleString('en-GB') : "N/A",
        },
        {
          label: "Last Updated",
          value: admin.updatedAt ? new Date(admin.updatedAt).toLocaleString('en-GB') : "N/A",
        },
      ]
    : [];

  return (
    <div className={modalWrapper}>
      <div className={modalCard}>
        <button onClick={onClose} className={modalClose}>
          <X className="w-5 h-5" />
        </button>

        <p className="text-lg font-bold mb-4">Admin Details</p>

        {isLoading ? (
          <PageLoader label="Loading admin..." className="py-8" />
        ) : error || !admin ? (
          <p className="py-8 text-center text-sm text-gray-500">No data available</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.label}
                className="flex justify-between gap-4 border-b border-gray-100 pb-2"
              >
                <span className="text-sm text-gray-500">{item.label}</span>
                <span className="text-sm font-medium text-gray-900 text-right break-words">
                  {item.value || "N/A"}
                </span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-md bg-gray-100 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function AdminEditModal({ admin, onClose }: { admin: any; onClose: () => void }) {
  const { updateAdminMutation } = useUsers();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<updateAdminInput>({
    resolver: zodResolver(updateAdminSchema),
    defaultValues: {
      firstName: admin.firstName ?? "",
      lastName: admin.lastName ?? "",
      email: admin.email ?? "",
      phoneNumber: admin.phoneNumber ?? "",
      location: admin.location ?? "",
    },
  });

  const onSubmit = (formData: updateAdminInput) => {
    updateAdminMutation.mutate({ id: admin.id, data: formData }, { onSuccess: onClose });
  };

  return (
    <div className={modalWrapper}>
      <div className={modalCard}>
        <button onClick={onClose} className={modalClose}>
          <X className="w-5 h-5" />
        </button>

        <p className="text-lg font-bold mb-1">Edit Admin</p>
        <p className="text-sm text-gray-500 mb-4">Update this admin account.</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <InputField
              label="First Name"
              id="editFirstName"
              placeholder="Enter First Name"
              error={errors.firstName?.message}
              {...register("firstName")}
            />
            <InputField
              label="Last Name"
              id="editLastName"
              placeholder="Enter Last Name"
              error={errors.lastName?.message}
              {...register("lastName")}
            />
          </div>

          <div className="mb-4">
            <InputField
              label="Email Address"
              id="editEmail"
              type="email"
              placeholder="Enter Email Address"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>

          <div className="mb-4">
            <InputField
              label="Phone Number"
              id="editPhoneNumber"
              placeholder="Enter Phone Number"
              error={errors.phoneNumber?.message}
              {...register("phoneNumber")}
            />
          </div>

          <div className="mb-6">
            <InputField
              label="Location"
              id="editLocation"
              placeholder="Enter Location"
              error={errors.location?.message}
              {...register("location")}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={updateAdminMutation.isPending}
              className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md py-2 text-sm font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <Button
              type="submit"
              loading={updateAdminMutation.isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminAccounts() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState('');
  const [sortFilter, setSortFilter] = useState<string | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);

  const [viewingId, setViewingId] = useState<string | null>(null);
  const [editingAdmin, setEditingAdmin] = useState<any | null>(null);
  const [deletingAdmin, setDeletingAdmin] = useState<any | null>(null);

  const { adminQuery, createAdminMutation, deleteAdminMutation } = useUsers();

  const { data, isLoading } = adminQuery({
    page,
    limit,
    search: search || undefined,
    sort: sortFilter,
  });

  const rawData = data?.data?.data || [];
  const totalCount: number = data?.data?.meta?.totalDocuments ?? rawData.length;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<createAdminInput, "role">>({
    resolver: zodResolver(createAdminSchema),
  });

  const tableData = useMemo(
    () =>
      rawData.map((item: any) => ({
        id: item.id,
        firstName: item.firstName,
        lastName: item.lastName,
        fullName:
          formatName(item.firstName, item.lastName) ||
          item.fullName ||
          "Unknown Admin",
        email: item.email || "N/A",
        phoneNumber: item.phoneNumber,
        location: item.location,
        role: item.role,
        verificationStatus: item.verificationStatus,
        createdAt: item.createdAt,
      })),
    [rawData],
  );

  const actions = useMemo(
    () => [
      {
        label: "View",
        icon: <Eye className="w-4 h-4" />,
        onClick: (row: any) => setViewingId(row.id),
      },
      {
        label: "Edit",
        icon: <Pencil className="w-4 h-4" />,
        onClick: (row: any) => setEditingAdmin(row),
      },
      {
        label: "Delete",
        icon: <Trash2 className="w-4 h-4" />,
        className: "p-2 text-gray-500 hover:bg-red-50 hover:text-red-600",
        onClick: (row: any) => setDeletingAdmin(row),
      },
    ],
    [],
  );

  const closeModal = () => {
    setShowModal(false);
    reset();
  };

  const onSubmit = (formData: Omit<createAdminInput, "role">) => {
    createAdminMutation.mutate(
      { ...formData, role: "super_admin" },
      { onSuccess: closeModal },
    );
  };

  const handleConfirmDelete = () => {
    if (!deletingAdmin) return;
    deleteAdminMutation.mutate(deletingAdmin.id, {
      onSuccess: () => setDeletingAdmin(null),
    });
  };

  return (
    <div className="bg-gray-50 mb-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-2xl font-bold">Admin Accounts</p>
          <p className="text-md text-gray-500">
            Manage admin accounts and create new admins
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md py-2 px-4 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Create Admin
        </button>
      </div>

      <div className="pt-4">
        <DataTable
          columns={COLUMNS}
          data={tableData}
          actions={actions}
          rowsPerPageOptions={[5, 8, 10, 20]}
          defaultRowsPerPage={limit}
          showSearch={true}
          searchPlaceholder="Search admins..."
          searchableColumns={["fullName", "email", "role", "location", "verificationStatus"]}
          filters={[
            {
              key: 'sort',
              label: 'Sort',
              options: [
                { value: 'newest', label: 'Newest' },
                { value: 'oldest', label: 'Oldest' },
              ],
            },
          ]}
          onFilterChange={(active) => {
            setSortFilter(active.sort && active.sort !== 'all' ? active.sort : undefined);
            setPage(1);
          }}
          showSerialNumber={true}
          isLoading={isLoading}
          serverSide={true}
          totalCount={totalCount}
          currentPage={page}
          onPageChange={(newPage) => setPage(newPage)}
          onSearchChange={(term) => {
            setSearch(term);
            setPage(1);
          }}
          onRowsPerPageChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
        />
      </div>

      {viewingId && <AdminViewModal id={viewingId} onClose={() => setViewingId(null)} />}

      {editingAdmin && (
        <AdminEditModal admin={editingAdmin} onClose={() => setEditingAdmin(null)} />
      )}

      {deletingAdmin && (
        <div className={modalWrapper}>
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
            <button
              onClick={() => setDeletingAdmin(null)}
              className={modalClose}
            >
              <X className="w-5 h-5" />
            </button>

            <p className="text-lg font-bold mb-1">Delete Admin</p>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to remove {deletingAdmin.fullName}? This cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeletingAdmin(null)}
                disabled={deleteAdminMutation.isPending}
                className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md py-2 text-sm font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteAdminMutation.isPending}
                className="flex items-center justify-center gap-2 flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50"
              >
                {deleteAdminMutation.isPending && <Spinner className="h-4 w-4" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className={modalWrapper}>
          <div className={modalCard}>
            <button onClick={closeModal} className={modalClose}>
              <X className="w-5 h-5" />
            </button>

            <p className="text-lg font-bold mb-1">Create Admin Account</p>
            <p className="text-sm text-gray-500 mb-4">
              Set up a new admin to manage the dashboard.
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <InputField
                  label="First Name"
                  id="firstName"
                  placeholder="Enter First Name"
                  error={errors.firstName?.message}
                  {...register("firstName")}
                />
                <InputField
                  label="Last Name"
                  id="lastName"
                  placeholder="Enter Last Name"
                  error={errors.lastName?.message}
                  {...register("lastName")}
                />
              </div>

              <div className="mb-4">
                <InputField
                  label="Email Address"
                  id="email"
                  type="email"
                  placeholder="Enter Email Address"
                  error={errors.email?.message}
                  {...register("email")}
                />
              </div>

              <div className="mb-4">
                <InputField
                  label="Phone Number"
                  id="phoneNumber"
                  placeholder="Enter Phone Number"
                  error={errors.phoneNumber?.message}
                  {...register("phoneNumber")}
                />
              </div>

              <div className="mb-6">
                <InputField
                  label="Location"
                  id="location"
                  placeholder="Enter Location"
                  error={errors.location?.message}
                  {...register("location")}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={createAdminMutation.isPending}
                  className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md py-2 text-sm font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  loading={createAdminMutation.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                >
                  Create Admin
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
