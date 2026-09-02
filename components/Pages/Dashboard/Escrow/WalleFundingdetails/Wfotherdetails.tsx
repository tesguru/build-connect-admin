import React, { useState } from "react";
import WFOverview from "./Wfoverview";
import WFTimeline from "./Wftimeline";


const WFOtherdetails = ({ funding }: any) => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "timeline", label: "Timeline" },
  ];

  return (
    <div className="p-6">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                pb-4 px-1 text-sm font-medium transition-colors relative
                ${
                  activeTab === tab.id
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }
              `}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === "overview" && <WFOverview funding={funding} />}
        {activeTab === "timeline" && <WFTimeline funding={funding} />}
      </div>
    </div>
  );
};

export default WFOtherdetails;