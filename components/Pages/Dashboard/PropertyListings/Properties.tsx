import React, { useState, useMemo } from 'react'
import DashboardLayout from '../DashboardLayout/DashboardLayout'
import { URLS } from '@/libs/constants/pageurl'
import ActionButton from '@/components/ui/Button/ActionButton'
import { PropertyCard } from '@/components/ui/Custom/PropertyCard'
import { useProperty } from '@/libs/hooks/useProperty'
import { useRouter } from 'next/navigation'
import {
  SlidersHorizontal,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// API Query Params — matches backend spec
// ─────────────────────────────────────────────────────────────────────────────
interface PropertyQueryParams {
  page?: number
  limit?: number
  search?: string
  status?: 'draft' | 'published' | 'archived'
  // propertyTypeId?: string   // uncomment when property types API is ready
  // builderId?: string        // uncomment when needed
}

const STATUS_OPTIONS = [
  { label: 'Any', value: undefined },
  { label: 'Published', value: 'published' as const },
  { label: 'Draft', value: 'draft' as const },
  { label: 'Archived', value: 'archived' as const },
]

function countActiveFilters(params: PropertyQueryParams): number {
  return [params.status].filter((v) => v !== undefined && v !== null && v !== '').length
}

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

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
const Properties = () => {
  const router = useRouter()
  const { getPropertiesQuery } = useProperty()

  const [queryParams, setQueryParams] = useState<PropertyQueryParams>({ page: 1, limit: 20 })
  const [searchText, setSearchText] = useState('')
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [draftStatus, setDraftStatus] = useState<PropertyQueryParams['status']>(undefined)

  // ── API call ───────────────────────────────────────────────────────────────
  const { data, isLoading, error } = getPropertiesQuery(queryParams)

  const rawData = data?.data?.data ?? []
  const meta = data?.data?.meta
  const totalDocuments: number = meta?.totalDocuments ?? 0
  const totalPages: number = meta?.totalPage ?? 1
  const currentPage: number = queryParams.page ?? 1
  const limit: number = queryParams.limit ?? 20

  const properties = useMemo(
    () =>
      rawData.map((item: any) => ({
        id: item.id,
        title: item.title ?? 'Untitled',
        address: item.location ?? 'Location not specified',
        price: item.price ? `₦${Number(item.price).toLocaleString()}` : 'Price on request',
        image: item.media?.[0]?.url,
        status: item.status?.charAt(0).toUpperCase() + item.status?.slice(1),
      })),
    [rawData],
  )

  const activeFilterCount = countActiveFilters(queryParams)

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setQueryParams((prev) => ({ ...prev, page: 1, search: searchText.trim() || undefined }))
  }

  const clearSearch = () => {
    setSearchText('')
    setQueryParams((prev) => ({ ...prev, page: 1, search: undefined }))
  }

  const openFilterModal = () => {
    setDraftStatus(queryParams.status)
    setShowFilterModal(true)
  }

  const applyFilters = () => {
    setQueryParams((prev) => ({ ...prev, page: 1, status: draftStatus }))
    setShowFilterModal(false)
  }

  const clearAllFilters = () => {
    setDraftStatus(undefined)
    setQueryParams({ page: 1, limit: 20, search: searchText.trim() || undefined })
    setShowFilterModal(false)
  }

  const goToPage = (page: number) => setQueryParams((prev) => ({ ...prev, page }))

  return (
    <DashboardLayout urlpath={URLS.DASHBOARD.PROPERTIES}>
      <div>

    
        <div className="flex justify-between items-center">
          <p className="text-2xl font-bold">Property Listing</p>

        </div>

   
       

   
        <div className="mt-4 flex items-center gap-3">
          <form onSubmit={handleSearch} className="flex-1 flex items-center bg-gray-100 rounded-xl px-3 py-2.5 gap-2">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
              placeholder="Search properties..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            {searchText.length > 0 && (
              <button type="button" onClick={clearSearch}>
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </form>
          <button
            type="button"
            onClick={openFilterModal}
            className="relative bg-gray-100 rounded-xl p-3 hover:bg-gray-200 transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5" color={activeFilterCount > 0 ? '#2563eb' : '#374151'} />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 rounded-full w-4 h-4 flex items-center justify-center">
                <span className="text-white font-bold" style={{ fontSize: 9 }}>{activeFilterCount}</span>
              </span>
            )}
          </button>
        </div>

      
        {activeFilterCount > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {queryParams.status && (
              <button
                className="flex items-center gap-1 bg-blue-50 border border-blue-200 rounded-full px-3 py-1 text-blue-600 text-xs font-semibold"
                onClick={() => setQueryParams((p) => ({ ...p, status: undefined, page: 1 }))}
              >
                {queryParams.status.charAt(0).toUpperCase() + queryParams.status.slice(1)}
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

  
        <div className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl shadow-lg overflow-hidden animate-pulse">
                  <div className="w-full h-64 bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-6 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-500 text-sm">Error loading properties: {(error as Error).message}</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-sm">No properties found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div
                key={property.id}
                className="cursor-pointer"
                onClick={() => {
                  sessionStorage.setItem('property_detail', JSON.stringify(rawData.find((r: any) => r.id === property.id)))
                  router.push(`/property-details/${property.id}`)
                }}
              >
                  <PropertyCard
                    title={property.title}
                    address={property.address}
                    price={property.price}
                    image={property.image}
                    status={property.status}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

       
        {!isLoading && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing{' '}
              <span className="font-medium text-gray-800">
                {(currentPage - 1) * limit + 1}–{Math.min(currentPage * limit, totalDocuments)}
              </span>{' '}
              of <span className="font-medium text-gray-800">{totalDocuments}</span> properties
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...')
                  acc.push(p)
                  return acc
                }, [])
                .map((p, idx) =>
                  p === '...' ? (
                    <span key={`ellipsis-${idx}`} className="px-1 text-gray-400 text-sm">...</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => goToPage(p as number)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === p ? 'bg-blue-600 text-white' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ── Filter Modal ── */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilterModal(false)} />
          <div className="relative z-10 bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] flex flex-col shadow-xl">
            <div className="flex justify-between items-center px-5 pt-5 pb-4 border-b border-gray-100">
              <button onClick={() => setShowFilterModal(false)}>
                <X className="w-5 h-5 text-gray-700" />
              </button>
              <p className="font-bold text-lg text-gray-900">Filters</p>
              <button onClick={clearAllFilters}>
                <span className="text-blue-600 font-semibold text-sm">Clear all</span>
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-5 pb-6">
              <div className="mt-6">
                <p className="font-bold text-base text-gray-900 mb-1">Status</p>
                <p className="text-xs text-gray-400 mb-3">Filter by publication status</p>
                <div className="flex flex-wrap">
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectChip
                      key={String(opt.value)}
                      label={opt.label}
                      selected={draftStatus === opt.value}
                      onClick={() => setDraftStatus(opt.value)}
                    />
                  ))}
                </div>
              </div>

              {/* ── Uncomment when property types API is ready ───────────────
              <div className="mt-6">
                <p className="font-bold text-base text-gray-900 mb-1">Property Type</p>
                <p className="text-xs text-gray-400 mb-3">Filter by type of property</p>
                ...chips here...
              </div> */}
            </div>

            <div className="px-5 pb-6 pt-4 border-t border-gray-100">
              <button
                onClick={applyFilters}
                className="w-full bg-blue-600 hover:bg-blue-700 transition-colors rounded-2xl py-3.5 text-white font-bold text-base"
              >
                Apply Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default Properties