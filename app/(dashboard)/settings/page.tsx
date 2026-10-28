"use client"
import { Suspense } from 'react'
import Settings from '@/components/Pages/Dashboard/Settings/Settings'


const page = () => {
  return (
    <Suspense fallback={null}>
      <Settings/>
    </Suspense>
  )
}

export default page
