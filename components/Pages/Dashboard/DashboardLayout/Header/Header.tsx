import UserProfileDropdown from '@/components/ui/UserProfile'
import { Bell } from 'lucide-react'
import React from 'react'

const Header = () => {
  return (
  <div className="bg-white border-b border-gray-200 p-3">
           <div className="flex items-center justify-end">
             <div className="flex items-center space-x-4">
               
               <UserProfileDropdown />
             </div>
           </div>
         </div>
  )
}

export default Header
