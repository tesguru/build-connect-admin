import React from 'react'
import DashboardLayout from '../DashboardLayout/DashboardLayout'
import { URLS } from '@/libs/constants/pageurl'
import Image from 'next/image'
import { AvatarImage } from '@/libs/constants/image'
import Button from '@/components/ui/Button/Button'
import Otherdetails from './Others/Otherdetails'
import { AlertCircle, AlertTriangle, Building2 } from 'lucide-react'
import MetricsCard from '@/components/ui/Custom/MetricsCard'
import BackButton from '@/components/ui/BackButton'
import { useUsers } from '@/libs/hooks/useUsers'
import { formatName, formatStatus } from '@/libs/utils/helpers'
import { PageLoader } from '@/components/ui/Custom/LoadingState'

export interface UserDetailsProps {
  id: string;
}

const UserDetails = ({ id }: UserDetailsProps) => {


  const { singleUserQuery } = useUsers()
  const { data, isLoading, error } = singleUserQuery(id); 

  console.log('User data:', data);
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
  const metrics = [
    {
      icon: Building2,
      label: 'Total Projects',
      value: user.projectsCount || 0,
      change: 15,
      isPositive: true
    },
    {
      icon: AlertCircle,
      label: 'Documents',
      value: user.documentsCount || 0,
      change: 15,
      isPositive: false
    },
    {
      icon: AlertTriangle,
      label: 'Total Spent',
      value: '₦0', 
      change: 15,
      isPositive: true
    },
    {
      icon: AlertTriangle,
      label: 'Total Earned',
      value: '₦0', 
      change: 15,
      isPositive: true
    }
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
          <div className="flex gap-4 mb-4">
            <p className="text-gray-800 font-semibold">
              {formatName(user.firstName, user.lastName)}
            </p>
            <Button
              className={`text-xs ${
                user.verificationStatus === 'verified'
                  ? 'bg-green-100 text-green-600'
                  : user.verificationStatus === 'pending'
                  ? 'bg-yellow-100 text-yellow-600'
                  : user.verificationStatus === 'rejected'
                  ? 'bg-red-100 text-red-600'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {formatStatus(user.verificationStatus) || 'Pending'}
            </Button>
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