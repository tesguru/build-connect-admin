import React from 'react'
import DashboardLayout from '../DashboardLayout/DashboardLayout'
import { URLS } from '@/libs/constants/pageurl'
import Image from 'next/image'
import { AvatarImage } from '@/libs/constants/image'
import Otherdetails from './Others/Otherdetails'
import { AlertCircle, AlertTriangle, Building2 } from 'lucide-react'
import BackButton from '@/components/ui/BackButton'
import { useUsers } from '@/libs/hooks/useUsers'
import { formatName } from '@/libs/utils/helpers'
import MetricsCard from '@/components/ui/Custom/MetricsCard'
import { UserDetailsProps } from '../UserDetails/UserDetails'
import { PageLoader } from '@/components/ui/Custom/LoadingState'
import { NairaIcon } from '@/components/ui/Custom/NairaIcon'
import VerificationStatus from '@/components/ui/Custom/VerificationStatus'

const BuilderDetails = ({ id }: UserDetailsProps) => {
  const { singleBuilderQuery } = useUsers()
  const { data, isLoading, error } = singleBuilderQuery(id);

  // Handle loading state
  if (isLoading) {
    return (
      <DashboardLayout urlpath={URLS.DASHBOARD.USERS}>
        <BackButton label="Back" />
        <PageLoader label="Loading builder details..." />
      </DashboardLayout>
    )
  }

  // Handle error state
  if (error) {
    return (
      <DashboardLayout urlpath={URLS.DASHBOARD.USERS}>
        <BackButton label="Back" />
        <div className="text-center p-8 text-sm text-gray-500">
          No data available
        </div>
      </DashboardLayout>
    )
  }

  // Handle case where no data is returned
  if (!data?.data) {
    return (
      <DashboardLayout urlpath={URLS.DASHBOARD.USERS}>
        <BackButton label="Back" />
        <div className="text-yellow-500 text-center p-4">
          No builder data found
        </div>
      </DashboardLayout>
    )
  }

  const user = data.data.data; // Your response has user data directly in data.data
  const totals = user.totals || {};

  const metrics = [
    {
      icon: Building2,
      label: "Completed Projects",
      value: totals.projects || 0,
      isPositive: true,
    },
    {
      icon: AlertCircle,
      label: "Total Bids",
      value: totals.bids || 0,
      isPositive: false,
    },
    {
      icon: NairaIcon,
      label: "Total Earned",
      value: `₦${(totals.totalEarned || 0).toLocaleString()}`,
      isPositive: true,
    },
    {
      icon: AlertTriangle,
      label: "Total Documents",
      value: totals.documents || 0,
      isPositive: true,
    }
  ];

  return (
    <DashboardLayout urlpath={URLS.DASHBOARD.USERS}>
      <BackButton label="Back" />
      
      {/* User Profile Section */}
      <div className="flex gap-4 items-start">
        <div>
          <button className="w-20 h-20 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-400">
            <Image
              src={AvatarImage}
              alt="User Avatar"
              className="w-full h-full object-cover"
              width={80}
              height={80}
            />
          </button>
        </div>

        <div className="mt-2">
          <div className="flex gap-4 mb-4 items-center flex-wrap">
            <p className="text-gray-800 font-semibold text-lg">
              {formatName(user.firstName, user.lastName)}
            </p>
            <VerificationStatus
              id={id}
              name={formatName(user.firstName, user.lastName)}
              status={user.verificationStatus}
            />
          </div>
   
          <div className="flex gap-4 flex-wrap">
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-600">{user.phoneNumber}</p>
          </div>

          <div className="flex gap-4 mt-2 text-sm text-gray-500">
            <span className="capitalize">Role: {user.role}</span>
            <span>Email Verified: {user.isEmailVerified ? 'Yes' : 'No'}</span>
            <span>Account Verified: {user.isVerified ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>

   
      <div className="mt-6">
        <MetricsCard metrics={metrics} />
      </div>

  
      <div className="mt-6">
        <Otherdetails id={id} />
      </div>
    </DashboardLayout>
  )
}

export default BuilderDetails