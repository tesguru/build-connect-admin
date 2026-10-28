import React from "react";

import TicketsTable from "./TicketTable";

const Tickets = () => {
  return (
      <div className="bg-gray-50">
      
        <div className="flex justify-between mb-6">
          <div>
            <p className="text-2xl font-bold">Support Tickets</p>
            <p className="text-md">Manage and track all support tickets</p>
          </div>
        </div>
        <TicketsTable />
      </div>
  );
};

export default Tickets;
