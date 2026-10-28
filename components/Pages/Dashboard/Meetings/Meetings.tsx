import React from 'react'
import DashboardLayout from '../DashboardLayout/DashboardLayout'
import { URLS } from '@/libs/constants/pageurl'
import ActionButton from '@/components/ui/Button/ActionButton'
import { PlusIcon } from 'lucide-react'
import MeetingsTable from './MeetingsTable'

const DocumentReview = () => {
  return (
    <DashboardLayout urlpath={URLS.DASHBOARD.MEETING}>
        <div className="flex justify-between mb-6">
           <div>
            <p className="text-2xl font-bold">
            Schedule Meetings
            </p>
         
        </div>

             <div>
                <ActionButton
          label="Schedule Meeting"
          icon={<PlusIcon />}
          href="/schedule-meetings"
        />
             </div>
             
        </div>
        <MeetingsTable/>
         
    </DashboardLayout>
 
  )
}

export default DocumentReview