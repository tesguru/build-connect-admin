'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import TicketDetails from '@/components/Pages/Dashboard/Supports/Tickets/TicketDetails'

const page = () => {
  const params = useParams()
  const { id } = params
  return <TicketDetails id={id as string} />
}

export default page
