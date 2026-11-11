import React from 'react'
import DashboardLayout from '../DashboardLayout/DashboardLayout'
import { URLS } from '@/libs/constants/pageurl'
import Image from 'next/image'
import { AvatarImage } from '@/libs/constants/image'
import Otherdetails from './Others/Otherdetails'
import { AlertCircle, Building2 } from 'lucide-react'
import MetricsCard from '@/components/ui/Custom/MetricsCard'
import BackButton from '@/components/ui/BackButton'
import { useUsers } from '@/libs/hooks/useUsers'
import { formatName } from '@/libs/utils/helpers'
import { PageLoader } from '@/components/ui/Custom/LoadingState'
import { NairaIcon } from '@/components/ui/Custom/NairaIcon'
import VerificationStatus from '@/components/ui/Custom/VerificationStatus'

export interface UserDetailsProps {
  id: string;
}

const UserDetails = ({ id }: UserDetailsProps) => {
  const { singleUserQuery } = useUsers()
  const { data, isLoading, error } = singleUserQuery(id);

  if (isLoading) {
    return (
      <DashboardLayout urlpath={URLS.DASHBOARD.USERS}>
        <PageLoader label="Loading user details..." />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout urlpath={URLS.DASHBOARD.USERS}>
        <div className="text-center p-8 text-sm text-gray-500">
          No data available
        </div>
      </DashboardLayout>
    );
  }

 
  const user = data?.data?.data || {};
  const totals = user.totals || {};

  const metrics = [
    {
      icon: Building2,
      label: 'Total Projects',
      value: totals.projects ?? 0,
      isPositive: true
    },
    {
      icon: AlertCircle,
      label: 'Documents',
      value: totals.documents ?? 0,
      isPositive: false
    },
    {
      icon: NairaIcon,
      label: 'Total Spent',
      value: `₦${Number(totals.totalSpend ?? 250000).toLocaleString()}`,
      isPositive: true
    },
  
  ];

  return (
    <DashboardLayout urlpath={URLS.DASHBOARD.USERS}>
      <BackButton/>
      <div className="flex gap-4">
        <div>
          <button className="w-20 h-20 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-400">
            <Image
              src={AvatarImage}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </button>
        </div>

        <div className="mt-9">
          <div className="flex gap-4 mb-4 items-center flex-wrap">
            <p className="text-gray-800 font-semibold">
              {formatName(user.firstName, user.lastName)}
            </p>
            <VerificationStatus
              id={id}
              name={formatName(user.firstName, user.lastName)}
              status={user.verificationStatus}
            />
          </div>
   
          <div className="flex gap-4">
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-600">{user.phoneNumber}</p>
          </div>
        </div>
      </div>

      <MetricsCard metrics={metrics}/>
      <Otherdetails id={id}/>
    </DashboardLayout>
  )
}

export default UserDetails