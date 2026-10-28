'use client'
import React, { Suspense } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import ProjectBidDetails from '@/components/Pages/Dashboard/ProjectBidDetails/ProjectBidDetails'

const BidDetailsPage = () => {
  const params = useParams()
  const searchParams = useSearchParams()
  const bidId = (params?.id as string) ?? ''
  const userId = searchParams.get('userId') ?? ''

  return <ProjectBidDetails bidId={bidId} userId={userId} />
}

const page = () => (
  <Suspense fallback={null}>
    <BidDetailsPage />
  </Suspense>
)

export default page
