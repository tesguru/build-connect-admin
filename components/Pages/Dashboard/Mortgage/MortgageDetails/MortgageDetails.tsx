import { User, Home, Briefcase, RefreshCw, Gavel } from 'lucide-react'
import { NairaIcon } from '@/components/ui/Custom/NairaIcon'
import { PageLoader, Spinner } from '@/components/ui/Custom/LoadingState'
import { URLS } from '@/libs/constants/pageurl'
import BackButton from '@/components/ui/BackButton'
import { InfoGrid, InfoItem } from '@/components/ui/Custom/Infogrid'
import DashboardLayout from '../../DashboardLayout/DashboardLayout'
import { useMortgage } from '@/libs/hooks/useMortgage'
import { useState } from 'react'
import MAOtherdetails from './Maotherdetails'


interface MortgageDetailsProps {
  id: string
}


const statusStyles: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-700',
  under_review: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-600',
}

const STATUS_OPTIONS = [
  { value: 'submitted', label: 'Submitted' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'cancelled', label: 'Cancelled' },
]

const DECISION_OPTIONS = [
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'pending', label: 'Pending' },
]


interface UpdateModalProps {
  title: string
  subtitle: string
  options: { value: string; label: string }[]
  selectedValue: string
  onSelect: (v: string) => void
  note: string
  onNoteChange: (v: string) => void
  onClose: () => void
  onSubmit: () => void
  isPending: boolean
  error: string | null
}

const UpdateModal = ({
  title, subtitle, options, selectedValue, onSelect,
  note, onNoteChange, onClose, onSubmit, isPending, error,
}: UpdateModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/40" onClick={onClose} />
    <div className="relative z-10 bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-1">{title}</h2>
      <p className="text-sm text-gray-500 mb-6">{subtitle}</p>

      {/* Options */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select <span className="text-red-500">*</span>
        </label>
        <select
          value={selectedValue}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>Choose an option...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Notes */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          rows={3}
          placeholder="Add a note..."
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          disabled={isPending}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          disabled={!selectedValue || isPending}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Spinner className="h-4 w-4" />
              Updating...
            </>
          ) : 'Update'}
        </button>
      </div>
    </div>
  </div>
)

const MortgageDetails = ({ id }: MortgageDetailsProps) => {
  const { singlePropertyQuery, updateMortgageStatus, updateMortgageDecision } = useMortgage()

  const { data, isLoading, error } = singlePropertyQuery(id)
  const application = data?.data?.data

  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [statusNote, setStatusNote] = useState('')
  const [statusError, setStatusError] = useState<string | null>(null)

  const [decisionModalOpen, setDecisionModalOpen] = useState(false)
  const [selectedDecision, setSelectedDecision] = useState('')
  const [decisionNote, setDecisionNote] = useState('')
  const [decisionError, setDecisionError] = useState<string | null>(null)


  if (isLoading) {
    return (
      <DashboardLayout urlpath={URLS.DASHBOARD.MORTGAGE}>
        <div className="bg-gray-50 min-h-screen p-4">
          <BackButton label="Back" />
          <PageLoader label="Loading application..." />
        </div>
      </DashboardLayout>
    )
  }


  if (error) {
    return (
      <DashboardLayout urlpath={URLS.DASHBOARD.MORTGAGE}>
        <div className="bg-gray-50 min-h-screen p-4">
          <BackButton label="Back" />
          <div className="mt-4 p-8 text-center text-sm text-gray-500">
            No data available
          </div>
        </div>
      </DashboardLayout>
    )
  }


  if (!application) {
    return (
      <DashboardLayout urlpath={URLS.DASHBOARD.MORTGAGE}>
        <div className="bg-gray-50 min-h-screen p-4">
          <BackButton label="Back" />
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-600">Application not found.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const statusLabel = application.status?.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
  const statusStyle = statusStyles[application.status] ?? 'bg-gray-100 text-gray-700'
  const decisionLabel = application.decisionOutcome?.replace(/\b\w/g, (c: string) => c.toUpperCase())

  const infoItems: InfoItem[] = [
    {
      icon: User,
      label: 'Applicant',
      value: application.applicant?.name || application.applicant?.email || 'Not specified',
    },
    {
      icon: Home,
      label: 'Property',
      value: application.property?.title ?? 'N/A',
    },
    {
      icon: Briefcase,
      label: 'Employment',
      value: application.employmentStatus?.label ?? 'N/A',
    },
    {
      icon: NairaIcon,
      label: 'Annual Income',
      value: application.annualGrossIncome
        ? `₦${Number(application.annualGrossIncome).toLocaleString()}`
        : 'N/A',
    },
  ]


  const handleUpdateStatus = () => {
    if (!selectedStatus) return
    setStatusError(null)
    updateMortgageStatus.mutate(
      { applicationId:id, status: selectedStatus, decisionNotes: statusNote },
      {
        onSuccess: () => setStatusModalOpen(false),
        onError: (err: any) => setStatusError(err?.message ?? 'Failed to update status.'),
      },
    )
  }

  const handleUpdateDecision = () => {
    if (!selectedDecision) return
    setDecisionError(null)
    updateMortgageDecision.mutate(
      { applicationId:id, decisionOutcome: selectedDecision, decisionNotes: decisionNote },
      {
        onSuccess: () => setDecisionModalOpen(false),
        onError: (err: any) => setDecisionError(err?.message ?? 'Failed to update decision.'),
      },
    )
  }

  return (
    <DashboardLayout urlpath={URLS.DASHBOARD.MORTGAGE}>
      <div className="bg-gray-50 min-h-screen">
        <div className="p-4">
          <BackButton label="Back" />

          <div className="p-4">
            <div className="flex justify-between mb-6">
         
              <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {application.applicant?.name ?? 'Mortgage Application'}
                  </h1>
                  <span className={`px-3 py-1 text-sm font-medium rounded-md ${statusStyle}`}>
                    {statusLabel}
                  </span>
                  {application.decisionOutcome && (
                    <span className="px-3 py-1 text-sm font-medium rounded-md bg-purple-100 text-purple-700">
                      Decision: {decisionLabel}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">Application ID: {application.id}</p>
              </div>

       
              <div className="flex items-start gap-3">
                <button
                  onClick={() => {
                    setSelectedStatus(application.status ?? '')
                    setStatusNote('')
                    setStatusError(null)
                    setStatusModalOpen(true)
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Update Status
                </button>
                <button
                  onClick={() => {
                    setSelectedDecision(application.decisionOutcome ?? '')
                    setDecisionNote('')
                    setDecisionError(null)
                    setDecisionModalOpen(true)
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors"
                >
                  <Gavel className="w-4 h-4" />
                  Update Decision
                </button>
              </div>
            </div>

            <InfoGrid items={infoItems} />
          </div>

          <MAOtherdetails application={application} />
        </div>
      </div>

  
      {statusModalOpen && (
        <UpdateModal
          title="Update Application Status"
          subtitle="Select a new status for this mortgage application."
          options={STATUS_OPTIONS}
          selectedValue={selectedStatus}
          onSelect={setSelectedStatus}
          note={statusNote}
          onNoteChange={setStatusNote}
          onClose={() => setStatusModalOpen(false)}
          onSubmit={handleUpdateStatus}
          isPending={updateMortgageStatus.isPending}
          error={statusError}
        />
      )}

      {decisionModalOpen && (
        <UpdateModal
          title="Update Decision Outcome"
          subtitle="Select the decision outcome for this mortgage application."
          options={DECISION_OPTIONS}
          selectedValue={selectedDecision}
          onSelect={setSelectedDecision}
          note={decisionNote}
          onNoteChange={setDecisionNote}
          onClose={() => setDecisionModalOpen(false)}
          onSubmit={handleUpdateDecision}
          isPending={updateMortgageDecision.isPending}
          error={decisionError}
        />
      )}
    </DashboardLayout>
  )
}

export default MortgageDetails