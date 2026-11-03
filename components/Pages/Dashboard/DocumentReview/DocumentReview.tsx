import React from 'react'
import DocumentReviewTable from './DocumentReviewTable'
import DashboardLayout from '../DashboardLayout/DashboardLayout'
import { URLS } from '@/libs/constants/pageurl'
import ActionButton from '@/components/ui/Button/ActionButton'
import { PlusIcon } from 'lucide-react'

const DocumentReview = () => {
  return (
    <DashboardLayout urlpath={URLS.DASHBOARD.DOCUMENTS}>
        <div className="flex justify-between mb-6">
           <div>
            <p className="text-2xl font-bold">
            Documents Review
            </p>
            <p className="text-md">Review builder expressions of interest for upcoming projects</p>
        </div>

             <div>
             
             </div>
             
        </div>
         <DocumentReviewTable/>
         
    </DashboardLayout>
 
  )
}

export default DocumentReview