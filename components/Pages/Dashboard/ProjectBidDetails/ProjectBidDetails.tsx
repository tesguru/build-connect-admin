import React from 'react'
import DashboardLayout from '../DashboardLayout/DashboardLayout';
import BackButton from '@/components/ui/BackButton';
import { URLS } from '@/libs/constants/pageurl';
import { ProgressBar } from '@/components/ui/Custom/ProgressBar';
import { Building2, Calendar, User } from 'lucide-react';
import { NairaIcon } from '@/components/ui/Custom/NairaIcon';
import Button from '@/components/ui/Button/Button';
import { InfoGrid, InfoItem } from '@/components/ui/Custom/Infogrid';
import { useProjects } from '@/libs/hooks/useProjects';

const ProjectBidDetails = () => {

  
       const projectInfo: InfoItem[] = [
        {
          icon: User,
          label: 'Client',
          value: 'Mrs Tracy C.'
        },
        {
          icon: Building2,
          label: 'Builder',
          value: 'Mike Chen'
        },
        {
          icon: NairaIcon,
          label: 'Budget',
          value: '₦15,000,000'
        },
        {
          icon: Calendar,
          label: 'Timeline',
          value: 'Feb 13, 2025 - Jan 30, 2026'
        }
      ];

       const costItems = [
    { name: "Labour Costs", amount: "₦15,000,000.00" },
    { name: "Equipment", amount: "₦15,000,000.00" },
    { name: "Materials", amount: "₦15,000,000.00" },
    { name: "Other Expenses", amount: "₦15,000,000.00" }
  ];
  return (
     <DashboardLayout urlpath={URLS.DASHBOARD.PROJECTS}>
      <div className=" bg-gray-50 ">
        <div className="">
        <BackButton label="Back" />
          <div className="  p-4">
            <div className="flex  justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Sunrise Shopping Plaza
                  </h1>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-md">
                    Completed
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Project ID: daf52109-a0bd-4db8-9c26-afa04cd79207
                </p>
              </div>
            <div className="flex gap-2">
           <Button className="bg-green-200">Accept</Button>
                <Button className="bg-red-200">Reject</Button>
              </div>   
            </div>

                <InfoGrid items={projectInfo} />
                <div>
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 sm:gap-6">
        <div className=" rounded-lg border border-gray-300 p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Project Description
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-6">
            This is a comprehensive construction project involving multiple phases
            of development. The project includes site preparation, foundation
            work, structural construction, and finishing. All work must comply with
            local building codes and regulations.
          </p>

          <h3 className="text-base font-semibold text-gray-900 mb-3 mt-6">
            Proposed Timeline
          </h3>
          <ul className="space-y-2 mb-6">
            <li className="text-sm text-gray-700 flex items-start">
              <span className="mr-2">•</span>
              <span>Project start: Within 2 weeks of approval</span>
            </li>
            <li className="text-sm text-gray-700 flex items-start">
              <span className="mr-2">•</span>
              <span>Foundation completion: 4-6 weeks</span>
            </li>
            <li className="text-sm text-gray-700 flex items-start">
              <span className="mr-2">•</span>
              <span>Structure completion: 12-16 weeks</span>
            </li>
            <li className="text-sm text-gray-700 flex items-start">
              <span className="mr-2">•</span>
              <span>Final completion: 20-24 weeks</span>
            </li>
          </ul>

          <h3 className="text-base font-semibold text-gray-900 mb-3 mt-6">
            Key Features
          </h3>
          <ul className="space-y-2">
            <li className="text-sm text-gray-700 flex items-start">
              <span className="mr-2">•</span>
              <span>Premium materials included</span>
            </li>
            <li className="text-sm text-gray-700 flex items-start">
              <span className="mr-2">•</span>
              <span>2-year warranty on all work</span>
            </li>
            <li className="text-sm text-gray-700 flex items-start">
              <span className="mr-2">•</span>
              <span>Weekly progress reports</span>
            </li>
            <li className="text-sm text-gray-700 flex items-start">
              <span className="mr-2">•</span>
              <span>Dedicated project manager</span>
            </li>
          </ul>
        </div>

        {/* Right Card - Cost Breakdown */}
        <div className=" border border-gray-300 rounded-lg shadow-sm p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Cost Breakdown
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">Items</span>
              <span className="text-sm font-medium text-gray-600">Amount</span>
            </div>

            {costItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-700">{item.name}</span>
                <span className="text-sm font-medium text-gray-900">{item.amount}</span>
              </div>
            ))}

            <div className="flex justify-between items-center pt-4 mt-4 border-t-2 border-gray-200">
              <span className="text-sm font-semibold text-gray-900">Total Bid Payment</span>
              <span className="text-sm font-bold text-gray-900">₦15,000,000.00</span>
            </div>
          </div>
        </div>
      </div>
                </div>
          </div>
         
        .</div>
      </div>
    </DashboardLayout>
  )
}

export default ProjectBidDetails;