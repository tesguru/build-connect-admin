import { DataTable } from '@/components/ui/Datatable'
import { useMortgage } from '@/libs/hooks/useMortgage'
import DashboardLayout from '../DashboardLayout/DashboardLayout'
import { URLS } from '@/libs/constants/pageurl'
import { Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useMemo } from 'react'

const statusStyles: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-700',
  under_review: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-600',
}

const decisionStyles: Record<string, string> = {
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
}

const COLUMNS = [
  {
    key: 'applicant',
    header: 'Applicant',
    render: (row: any) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.applicantName}</span>
        <span className="text-xs text-gray-400">{row.applicantEmail}</span>
      </div>
    ),
  },
  {
    key: 'property',
    header: 'Property',
    render: (row: any) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.propertyTitle}</span>
        <span className="text-xs text-gray-400">{row.propertyLocation}</span>
      </div>
    ),
  },
  {
    key: 'price',
    header: 'Property Price',
    render: (row: any) => (
      <span className="font-semibold">
        ₦{Number(row.propertyPrice).toLocaleString()}
      </span>
    ),
  },
  {
    key: 'employmentStatus',
    header: 'Employment',
    render: (row: any) => (
      <span className="text-sm text-gray-600">{row.employmentStatus ?? '—'}</span>
    ),
  },
  {
    key: 'annualGrossIncome',
    header: 'Annual Income',
    render: (row: any) => (
      <span className="font-medium">₦{Number(row.annualGrossIncome).toLocaleString()}</span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (row: any) => {
      const style = statusStyles[row.status] ?? 'bg-gray-100 text-gray-700'
      const label = row.status?.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
      return (
        <span className={`px-3 py-1 rounded-md text-sm font-medium ${style}`}>{label}</span>
      )
    },
  },
  {
    key: 'decisionOutcome',
    header: 'Decision',
    render: (row: any) => {
      const style = decisionStyles[row.decisionOutcome] ?? 'bg-gray-100 text-gray-700'
      const label = row.decisionOutcome?.replace(/\b\w/g, (c: string) => c.toUpperCase())
      return (
        <span className={`px-3 py-1 rounded-md text-sm font-medium ${style}`}>
          {label ?? '—'}
        </span>
      )
    },
  },
  {
    key: 'createdAt',
    header: 'Applied At',
    render: (row: any) => (
      <span className="text-sm text-gray-500">
        {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '—'}
      </span>
    ),
  },
]

export default function MortgageApplications() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(8)
  const [search, setSearch] = useState('')

  const { getMortgageQuery } = useMortgage()
  const { data, isLoading } = getMortgageQuery({
    page,
    limit,
    search: search || undefined,
  })

  const rawData = data?.data?.data || []
  const totalCount: number = data?.data?.meta?.totalDocuments ?? rawData.length

  const tableData = useMemo(
    () =>
      rawData.map((item: any) => ({
        _raw: item,
        id: item.id,
        applicantName: item.applicant?.name ?? '—',
        applicantEmail: item.applicant?.email ?? '',
        propertyTitle: item.property?.title ?? '—',
        propertyLocation: item.property?.location ?? '—',
        propertyPrice: item.property?.price ?? 0,
        employmentStatus: item.employmentStatus?.label ?? '—',
        annualGrossIncome: item.annualGrossIncome ?? 0,
        status: item.status,
        decisionOutcome: item.decisionOutcome,
        createdAt: item.createdAt,
      })),
    [rawData],
  )

  const actions = useMemo(
    () => [
      {
        label: 'View',
        icon: <Eye className="w-4 h-4 text-gray-600" />,
        onClick: (row: any) => {
          sessionStorage.setItem('mortgage_detail', JSON.stringify(row._raw))
          router.push(`/mortgage-details/${row.id}`)
        },
      },
    ],
    [router],
  )

  return (
    <DashboardLayout urlpath={URLS.DASHBOARD.MORTGAGE}>
      <div className="bg-gray-50 mb-4">
        <div>
          <p className="text-2xl font-bold">Mortgage Applications</p>
          <p className="text-md text-gray-500">
            Review and manage all mortgage applications
          </p>
        </div>

        <div className="pt-4">
          <DataTable
            columns={COLUMNS}
            data={tableData}
            actions={actions}
            rowsPerPageOptions={[5, 8, 10, 20]}
            defaultRowsPerPage={limit}
            showSearch={true}
            searchPlaceholder="Search applications..."
            searchableColumns={['applicantName', 'applicantEmail', 'propertyTitle', 'status']}
            showSerialNumber={true}
            isLoading={isLoading}
            serverSide={true}
            totalCount={totalCount}
            currentPage={page}
            onPageChange={(newPage) => setPage(newPage)}
            onSearchChange={(term) => {
              setSearch(term)
              setPage(1)
            }}
            onRowsPerPageChange={(newLimit) => {
              setLimit(newLimit)
              setPage(1)
            }}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}