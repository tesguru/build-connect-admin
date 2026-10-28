import { formatName } from '@/libs/utils/helpers'

const MAOverview = ({ application }: any) => {
  const fmt = (val: number | undefined) =>
    val !== undefined ? `₦${Number(val).toLocaleString()}` : 'N/A'

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Application Overview</h1>

      {/* Decision notes */}
      {application?.decisionNotes && (
        <p className="text-gray-700 mb-8 leading-relaxed">
          <span className="font-semibold">Decision Notes: </span>
          {application.decisionNotes}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Personal Info */}
        <div>
          <h2 className="text-xl font-bold mb-4">Personal Information</h2>
          <ul className="space-y-2">
            <li className="text-gray-700">
              <span className="font-medium">Name: </span>
              {formatName(application?.firstName, application?.lastName) || 'N/A'}
            </li>
            <li className="text-gray-700">
              <span className="font-medium">Email: </span>
              {application?.emailAddress ?? application?.applicant?.email ?? 'N/A'}
            </li>
            <li className="text-gray-700">
              <span className="font-medium">Phone: </span>
              {application?.phoneNumber ?? application?.applicant?.phoneNumber ?? 'N/A'}
            </li>
            <li className="text-gray-700">
              <span className="font-medium">Date of Birth: </span>
              {application?.dateOfBirth
                ? new Date(application.dateOfBirth).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric',
                  })
                : 'N/A'}
            </li>
            <li className="text-gray-700">
              <span className="font-medium">Address: </span>
              {[application?.currentAddress, application?.city, application?.state, application?.postalCode]
                .filter(Boolean)
                .join(', ') || 'N/A'}
            </li>
          </ul>
        </div>

        {/* Employment Info */}
        <div>
          <h2 className="text-xl font-bold mb-4">Employment & Income</h2>
          <ul className="space-y-2">
            <li className="text-gray-700">
              <span className="font-medium">Occupation: </span>
              {application?.occupation ?? 'N/A'}
            </li>
            <li className="text-gray-700">
              <span className="font-medium">Employer: </span>
              {application?.employerName ?? 'N/A'}
            </li>
            <li className="text-gray-700">
              <span className="font-medium">Employment Status: </span>
              {application?.employmentStatus?.label ?? 'N/A'}
            </li>
            <li className="text-gray-700">
              <span className="font-medium">Annual Gross Income: </span>
              {fmt(application?.annualGrossIncome)}
            </li>
          </ul>
        </div>

        {/* Financials */}
        <div>
          <h2 className="text-xl font-bold mb-4">Financials</h2>
          <ul className="space-y-2">
            <li className="text-gray-700">
              <span className="font-medium">Savings Balance: </span>
              {fmt(application?.savingsAccountBalance)}
            </li>
            <li className="text-gray-700">
              <span className="font-medium">Checking Balance: </span>
              {fmt(application?.checkingAccountBalance)}
            </li>
            <li className="text-gray-700">
              <span className="font-medium">Investments: </span>
              {fmt(application?.investments)}
            </li>
            <li className="text-gray-700">
              <span className="font-medium">Credit Card Debts: </span>
              {fmt(application?.creditCardDebits)}
            </li>
            <li className="text-gray-700">
              <span className="font-medium">Other Loans: </span>
              {fmt(application?.otherLoans)}
            </li>
          </ul>
        </div>

        {/* Property Info */}
        <div>
          <h2 className="text-xl font-bold mb-4">Property</h2>
          <ul className="space-y-2">
            <li className="text-gray-700">
              <span className="font-medium">Title: </span>
              {application?.property?.title ?? 'N/A'}
            </li>
            <li className="text-gray-700">
              <span className="font-medium">Location: </span>
              {application?.property?.location ?? 'N/A'}
            </li>
            <li className="text-gray-700">
              <span className="font-medium">Price: </span>
              {application?.property?.price
                ? `₦${Number(application.property.price).toLocaleString()}`
                : 'N/A'}
            </li>
            <li className="text-gray-700">
              <span className="font-medium">Builder: </span>
              {application?.property?.builder?.name ?? 'N/A'}
            </li>
          </ul>
        </div>

      </div>
    </div>
  )
}

export default MAOverview