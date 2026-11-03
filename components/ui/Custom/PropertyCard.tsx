import React from "react";

interface PropertyCardProps {
  title: string;
  address: string;
  price: string | number;
  image?: string;
  status?: string;
}

export function PropertyCard({
  title,
  address,
  price,
  image,
  status,
}: PropertyCardProps) {
  return (
    <div className="max-w-sm bg-white rounded-3xl shadow-lg overflow-hidden">
      <div className="relative">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-55 object-cover"
          />
        ) : (
          <div className="w-full h-55 bg-gray-100 flex items-center justify-center">
            <span className="text-sm text-gray-400">No photo</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-md font-bold text-gray-900 flex-1">
            {title}
          </h2>
          {status && (
            <span className="ml-3 px-3 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded-full whitespace-nowrap">
              {status}
            </span>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4">
          {address}
        </p>

        <p className="text-2xl font-bold text-gray-900">
          {typeof price === "number" ? `₦${price.toLocaleString()}` : price}
        </p>
      </div>
    </div>
  );
}
