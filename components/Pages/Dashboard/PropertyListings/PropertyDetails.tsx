import { useProperty } from '@/libs/hooks/useProperty'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import DashboardLayout from '../DashboardLayout/DashboardLayout'
import { URLS } from '@/libs/constants/pageurl'
import BackButton from '@/components/ui/BackButton'
import { PageLoader, Spinner } from '@/components/ui/Custom/LoadingState'
import { BedDouble, Bath, Ruler, Pencil, RefreshCw, X, FileText, Download } from 'lucide-react'

interface PropertyDetailsProps {
  id: string
}

const statusStyles: Record<string, string> = {
  draft: 'bg-yellow-100 text-yellow-700',
  published: 'bg-green-100 text-green-700',
  archived: 'bg-gray-100 text-gray-600',
}

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
]

const SelectChip = ({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-1.5 rounded-full border text-sm font-medium mr-2 mb-2 transition-colors ${
      selected ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
    }`}
  >
    {label}
  </button>
)

const PropertyDetails = ({ id }: PropertyDetailsProps) => {
  const router = useRouter()
  const { singlePropertyQuery, updatePropertyStatus } = useProperty()


  const { data, isLoading, error } = singlePropertyQuery(id)
  const property = data?.data?.data


  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [updateError, setUpdateError] = useState<string | null>(null)


  if (isLoading) {
    return (
      <DashboardLayout urlpath={URLS.DASHBOARD.PROPERTIES}>
        <div className="bg-gray-50 min-h-screen p-4">
          <BackButton label="Back" />
          <PageLoader label="Loading property..." />
        </div>
      </DashboardLayout>
    )
  }


  if (error) {
    return (
      <DashboardLayout urlpath={URLS.DASHBOARD.PROPERTIES}>
        <div className="bg-gray-50 min-h-screen p-4">
          <BackButton label="Back" />
          <div className="mt-4 p-8 text-center text-sm text-gray-500">
            No data available
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!property) {
    return (
      <DashboardLayout urlpath={URLS.DASHBOARD.PROPERTIES}>
        <div className="bg-gray-50 min-h-screen p-4">
          <BackButton label="Back" />
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-600">Property not found.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const statusLabel = property.status?.charAt(0).toUpperCase() + property.status?.slice(1)
  const statusStyle = statusStyles[property.status] ?? 'bg-gray-100 text-gray-700'

  const handleOpenModal = () => {
    setSelectedStatus(property.status ?? '')
    setUpdateError(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setUpdateError(null)
  }

  const handleUpdate = () => {
    if (!selectedStatus) return
    setUpdateError(null)
    updatePropertyStatus.mutate(
      { propertyId:id, status: selectedStatus },
      {
        onSuccess: () => setIsModalOpen(false),
        onError: (err: any) =>
          setUpdateError(err?.message ?? 'Failed to update status. Please try again.'),
      },
    )
  }


  const images = (property.media ?? []).filter((m: any) => m.mimeType?.startsWith('image/'))
  const documents = (property.media ?? []).filter((m: any) => !m.mimeType?.startsWith('image/'))

  return (
    <DashboardLayout urlpath={URLS.DASHBOARD.PROPERTIES}>
      <div className="bg-white min-h-screen">
        <div className="p-4">
          <BackButton label="Back" />

      
          <div className="mt-4 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyle}`}>
                  {statusLabel}
                </span>
                <span className="text-sm text-gray-500">{property.location}</span>
              </div>
            </div>

        
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push(`/properties/${id}/edit`)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handleOpenModal}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Update Status
              </button>
            </div>
          </div>

     
          {images.length > 0 && (
            <div className="mt-6 border border-gray-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">Media</p>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img: any) => (
                  <img
                    key={img.id}
                    src={img.publicUrl}
                    alt={img.fileName}
                    className="w-44 h-32 object-cover rounded-lg shrink-0"
                  />
                ))}
              </div>
            </div>
          )}

       
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">

       
            <div className="border border-gray-200 rounded-xl p-5">
              <p className="text-sm font-semibold text-gray-900 mb-2">Property Description</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {property.description ?? 'No description provided.'}
              </p>

              {property.keyFeatures?.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Key Features</p>
                  <ul className="space-y-1">
                    {property.keyFeatures.map((feature: string, idx: number) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          
            <div className="border border-gray-200 rounded-xl p-5">
              <p className="text-sm font-semibold text-gray-900 mb-4">Key Details</p>
              <div className="space-y-5">

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <BedDouble className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{property.bedrooms ?? '—'} Bedrooms</p>
                    <p className="text-xs text-gray-500">Spacious and well lit room</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Bath className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{property.bathrooms ?? '—'} Bathrooms</p>
                    <p className="text-xs text-gray-500">Modern fixtures</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Ruler className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {property.propertyType?.label ?? '—'}
                    </p>
                    <p className="text-xs text-gray-500">Property type</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <span className="text-green-600 font-bold text-sm">₦</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {property.price ? `₦${Number(property.price).toLocaleString()}` : '—'}
                    </p>
                    <p className="text-xs text-gray-500">Listing price</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ── Attached Documents ── */}
          {documents.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-gray-900 mb-3">Attached Documents</p>
              <div className="space-y-2">
                {documents.map((doc: any) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{doc.fileName}</span>
                    </div>
                    <a
                      href={doc.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:underline"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

  
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={handleCloseModal} />
          <div className="relative z-10 bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Update Property Status</h2>
            <p className="text-sm text-gray-500 mb-6">Select a new status for this property.</p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Status <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap">
                {STATUS_OPTIONS.map((opt) => (
                  <SelectChip
                    key={opt.value}
                    label={opt.label}
                    selected={selectedStatus === opt.value}
                    onClick={() => setSelectedStatus(opt.value)}
                  />
                ))}
              </div>
            </div>

          

            <div className="flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                disabled={updatePropertyStatus.isPending}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={!selectedStatus || updatePropertyStatus.isPending}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updatePropertyStatus.isPending ? (
                  <>
                    <Spinner className="h-4 w-4" />
                    Updating...
                  </>
                ) : (
                  'Update Status'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default PropertyDetails