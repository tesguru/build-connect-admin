import { DataTable } from "@/components/ui/Datatable";
import { useUsers } from "@/libs/hooks/useUsers";
import { formatName } from "@/libs/utils/helpers";
import { Plus, X } from "lucide-react";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAdminSchema, createAdminInput } from "@/libs/schema/authschema";
import InputField from "@/components/ui/Forms/InputField";
import Dropdown from "@/components/ui/Forms/Dropdown";
import Button from "@/components/ui/Button/Button";

const ROLE_OPTIONS = [
  { value: "super_admin", label: "Super Admin" },
  { value: "supervisor", label: "Supervisor" },
  { value: "operations", label: "Operations" },
  { value: "support", label: "Support" },
];

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
    render: (row: any) => {
      const label = row.role
        ?.replace(/_/g, " ")
        .replace(/\b\w/g, (c: string) => c.toUpperCase());
      return (
        <span className="px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-700">
          {label || "N/A"}
        </span>
      );
    },
  },
  {
    key: "status",
    header: "Status",
    render: (row: any) => {
      const statusStyles: Record<string, string> = {
        verified: "bg-green-100 text-green-700",
        not_required: "bg-gray-100 text-gray-700",
      };
      const style = statusStyles[row.verificationStatus] || "bg-gray-100 text-gray-700";
      const label = row.verificationStatus
        ?.replace(/_/g, " ")
        .replace(/\b\w/g, (c: string) => c.toUpperCase());
      return (
        <span className={`px-3 py-1 rounded-md text-sm font-medium ${style}`}>
          {label || "N/A"}
        </span>
      );
    },
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

export default function AdminAccounts() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);
  const [sortFilter, setSortFilter] = useState<string | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);

  const { adminQuery, createAdminMutation } = useUsers();

  const { data, isLoading, refetch } = adminQuery({
    page,
    limit,
    search: search || undefined,
    role: roleFilter,
    sort: sortFilter,
  });

  const rawData = data?.data?.data || [];
  const totalCount: number = data?.data?.meta?.totalDocuments ?? rawData.length;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<createAdminInput>({
    resolver: zodResolver(createAdminSchema),
  });

  const role = watch("role");

  const tableData = useMemo(
    () =>
      rawData.map((item: any) => {
        const fullName =
          formatName(item.firstName, item.lastName) ||
          formatName(item.fullName) ||
          "Unknown Admin";

        return {
          _raw: item,
          id: item.id,
          fullName,
          email: item.email || item.user?.email || "N/A",
          phoneNumber: item.phoneNumber,
          location: item.location,
          role: item.role,
          verificationStatus: item.verificationStatus,
          createdAt: item.createdAt,
        };
      }),
    [rawData],
  );

  const closeModal = () => {
    setShowModal(false);
    reset();
  };

  const onSubmit = (formData: createAdminInput) => {
    createAdminMutation.mutate(formData, {
      onSuccess: () => {
        closeModal();
        refetch?.();
      },
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
          rowsPerPageOptions={[5, 8, 10, 20]}
          defaultRowsPerPage={limit}
          showSearch={true}
          searchPlaceholder="Search admins..."
          searchableColumns={["fullName", "email", "role", "location", "verificationStatus"]}
          filters={[
            {
              key: 'role',
              label: 'Role',
              options: [
                { value: 'super_admin', label: 'Super Admin' },
                { value: 'supervisor', label: 'Supervisor' },
                { value: 'operations', label: 'Operations' },
                { value: 'support', label: 'Support' },
              ],
            },
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
            setRoleFilter(active.role && active.role !== 'all' ? active.role : undefined);
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
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

              <div className="mb-4">
                <InputField
                  label="Location"
                  id="location"
                  placeholder="Enter Location"
                  error={errors.location?.message}
                  {...register("location")}
                />
              </div>

              <div className="mb-6">
                <Dropdown
                  width="full"
                  label="Role"
                  id="role"
                  value={role || ""}
                  onChange={(e) =>
                    setValue("role", e.target.value as createAdminInput["role"], {
                      shouldValidate: true,
                    })
                  }
                  options={ROLE_OPTIONS}
                  error={errors.role?.message as string}
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
