import React from 'react';
import { RoomData } from '../types';

interface CheckoutModalProps {
  roomData: RoomData;
  onConfirm: () => void;
  onCancel: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  roomData,
  onConfirm,
  onCancel,
}) => {
  const calculateTotal = () => {
    return roomData.services.reduce(
      (total, service) => total + service.price * service.quantity,
      0
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Checkout Details</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Personal Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{roomData.personalDetails?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{roomData.personalDetails?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Aadhaar</p>
                <p className="font-medium">{roomData.personalDetails?.aadhaar}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Check-in Time</p>
                <p className="font-medium">
                  {new Date(roomData.checkInTime!).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-600">Adults</p>
              <ul className="list-disc list-inside">
                <li>{roomData.personalDetails?.name} (Primary)</li>
                {roomData.personalDetails?.adults.map((adult, index) => (
                  <li key={index}>{adult.name}</li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Services</h3>
            <div className="space-y-2">
              {roomData.services.map((service) => (
                <div
                  key={service.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
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

          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Amount</span>
              <span>₹{calculateTotal()}</span>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Confirm Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};