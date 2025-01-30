import React, { useState } from 'react';
import { CheckoutData } from '../types';

interface CheckoutHistoryProps {
  checkouts: CheckoutData[];
}

export const CheckoutHistory: React.FC<CheckoutHistoryProps> = ({ checkouts }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  if (checkouts.length === 0) return null;

  return (
    <div className="mt-8">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h2 className="text-2xl font-bold mr-4">Checkout History</h2>
        <span className="text-gray-600">
          {isCollapsed ? '▼' : '▲'}
        </span>
      </div>
      {!isCollapsed && (
        <div className="space-y-6 mt-4">
          {checkouts.map((checkout, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Room {checkout.roomNumber}</h3>
                  <p className="text-sm text-gray-600">{checkout.floor}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    Check-in: {new Date(checkout.checkInTime!).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Check-out: {new Date(checkout.checkOutTime).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-4">
                <h4 className="font-medium mb-2">Guest Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{checkout.personalDetails?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{checkout.personalDetails?.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Aadhaar</p>
                    <p className="font-medium">{checkout.personalDetails?.aadhaar}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Number of Adults</p>
                    <p className="font-medium">{checkout.personalDetails?.numberOfAdults}</p>
                  </div>
                </div>
                {checkout.personalDetails?.adults.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Additional Adults</p>
                    <ul className="list-disc list-inside">
                      {checkout.personalDetails.adults.map((adult, idx) => (
                        <li key={idx} className="text-sm">{adult.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-4">
                <h4 className="font-medium mb-2">Services</h4>
                <div className="space-y-2">
                  {checkout.services.map((service) => (
                    <div
                      key={service.id}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded"
                    >
                      <div>
                        <p className="font-medium">
                          {service.name} x{service.quantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(service.date).toLocaleString()}
                        </p>
                      </div>
                      <p className="font-medium">₹{service.price * service.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Total Bill</span>
                  <span className="font-bold text-lg">₹{checkout.totalBill}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};