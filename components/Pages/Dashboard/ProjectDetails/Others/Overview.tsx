import React from 'react'

const Overview = ({project}:any) => {
  
  // Format date function
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Budget: API returns budgetMin / budgetMax
  const formatBudget = () => {
    const min = Number(project?.budgetMin);
    const max = Number(project?.budgetMax);
    const hasMin = !isNaN(min) && min > 0;
    const hasMax = !isNaN(max) && max > 0;

    if (hasMin && hasMax) {
      return min === max
        ? `₦${max.toLocaleString()}`
        : `₦${min.toLocaleString()} - ₦${max.toLocaleString()}`;
    }
    if (hasMax) return `₦${max.toLocaleString()}`;
    if (hasMin) return `₦${min.toLocaleString()}`;
    return 'Not set';
  };

  const hasDates = project?.startDate || project?.endDate;

  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-6">Project Details</h1>
      
      <p className="text-gray-700 mb-8 leading-relaxed">
       {project?.description || 'No description provided'}
      </p>

      <div className="grid grid-cols-2 gap-12">
        {/* Location */}
        <div>
          <h2 className="text-xl font-bold mb-4">Location</h2>
          <ul className="space-y-2">
            <li className="text-gray-700">{project?.location || 'Not specified'}</li>
          </ul>
        </div>

        {/* Budget */}
        <div>
          <h2 className="text-xl font-bold mb-4">Budget</h2>
          <ul className="space-y-2">
            <li className="text-gray-700">{formatBudget()}</li>
          </ul>
        </div>

        {/* Timeline */}
        <div>
          <h2 className="text-xl font-bold mb-4">Timeline</h2>
          {hasDates ? (
            <ul className="space-y-2">
              <li className="text-gray-700">
                Start Date: {formatDate(project?.startDate)}
              </li>
              <li className="text-gray-700">
                End Date: {formatDate(project?.endDate)}
              </li>
            </ul>
          ) : (
            <p className="text-gray-700">Project is yet to start</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Overview