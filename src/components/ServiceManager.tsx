import React, { useState } from 'react';
import { Service, PersonalDetails } from '../types';
import { FOOD_MENU, WATER_BOTTLES } from '../data/constants';
import { Trash2 } from 'lucide-react';

interface ServiceManagerProps {
  personalDetails: PersonalDetails;
  services: Service[];
  onAddService: (service: Service) => void;
  onEditPersonalDetails: () => void;
  onDeleteService: (serviceId: string) => void;
}

export const ServiceManager: React.FC<ServiceManagerProps> = ({
  personalDetails,
  services,
  onAddService,
  onEditPersonalDetails,
  onDeleteService,
}) => {
  const [serviceType, setServiceType] = useState<'food' | 'water' | 'other'>('food');
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customService, setCustomService] = useState({ name: '', price: 0 });
  const [showEditForm, setShowEditForm] = useState(false);
  const [editedDetails, setEditedDetails] = useState(personalDetails);
  // console.log(checkInDate);
  const handleAddService = () => {
    const newService: Service = {
      id: Date.now().toString(),
      type: serviceType,
      date: new Date().toISOString(),
      quantity,
      name: serviceType === 'other' ? customService.name : selectedItem,
      price:
        serviceType === 'other'
          ? customService.price
          : serviceType === 'food'
          ? FOOD_MENU.find((item) => item.name === selectedItem)?.price || 0
          : WATER_BOTTLES.find((item) => item.name === selectedItem)?.price || 0,
    };

    onAddService(newService);
    setSelectedItem('');
    setQuantity(1);
    setCustomService({ name: '', price: 0 });
  };

  const handleSavePersonalDetails = () => {
    onEditPersonalDetails(editedDetails);
    setShowEditForm(false);
  };

  const calculateTotal = () => {
    return services.reduce((total, service) => total + service.price * service.quantity, 0);
  };

  return (
    <div className="space-y-6">
      {/* Personal Details Section */}
      <div className="bg-gray-50 p-4 rounded-lg">
        {showEditForm ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-4">Edit Personal Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={editedDetails.name}
                  onChange={(e) => setEditedDetails({ ...editedDetails, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={editedDetails.phone}
                  onChange={(e) => setEditedDetails({ ...editedDetails, phone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Aadhaar</label>
                <input
                  type="text"
                  value={editedDetails.aadhaar}
                  onChange={(e) => setEditedDetails({ ...editedDetails, aadhaar: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Number of Adults</label>
                <input
                  type="number"
                  min="1"
                  value={editedDetails.numberOfAdults}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setEditedDetails({
                      ...editedDetails,
                      numberOfAdults: value,
                      adults: Array(value - 1).fill({ name: '' }),
                    });
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            {editedDetails.adults.map((adult, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700">
                  Adult {index + 2} Name
                </label>
                <input
                  type="text"
                  value={adult.name}
                  onChange={(e) => {
                    const newAdults = [...editedDetails.adults];
                    newAdults[index] = { name: e.target.value };
                    setEditedDetails({ ...editedDetails, adults: newAdults });
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            ))}
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowEditForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePersonalDetails}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Personal Details</h3>
              <button
                onClick={() => {
                  setEditedDetails(personalDetails);
                  setShowEditForm(true);
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{personalDetails.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{personalDetails.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Aadhaar</p>
                <p className="font-medium">{personalDetails.aadhaar}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Number of Adults</p>
                <p className="font-medium">{personalDetails.numberOfAdults}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Room Price Per Day</p>
                <p className="font-medium">{personalDetails.roomPrice}</p>
              </div>
              
            </div>
            {personalDetails.adults.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">Additional Adults</p>
                <ul className="list-disc list-inside">
                  {personalDetails.adults.map((adult, idx) => (
                    <li key={idx}>{adult.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Service Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium mb-4">Add Service</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Service Type</label>
            <select
              value={serviceType}
              onChange={(e) => {
                setServiceType(e.target.value as 'food' | 'water' | 'other');
                setSelectedItem('');
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="food">Food</option>
              <option value="water">Water</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {serviceType === 'other' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Service Name</label>
                <input
                  type="text"
                  value={customService.name}
                  onChange={(e) =>
                    setCustomService({ ...customService, name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                <input
                  type="number"
                  value={customService.price}
                  onChange={(e) =>
                    setCustomService({
                      ...customService,
                      price: parseFloat(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </>
          ) : (
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                {serviceType === 'food' ? 'Select Dish' : 'Select Bottle'}
              </label>
              <select
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select...</option>
                {(serviceType === 'food' ? FOOD_MENU : WATER_BOTTLES).map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name} - ₹{item.price}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <button
          onClick={handleAddService}
          disabled={
            serviceType === 'other'
              ? !customService.name || !customService.price
              : !selectedItem
          }
          className="w-full mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
        >
          Add Service
        </button>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Services Added</h3>
        <div className="space-y-2">
          {services.map((service) => (
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
              <div className="flex items-center space-x-4">
                <p className="font-medium">₹{service.price * service.quantity}</p>
                <button
                  onClick={() => onDeleteService(service.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
        {services.length > 0 && (
          <div className="flex justify-end pt-4 border-t">
            <p className="text-lg font-bold">
              Total: ₹{calculateTotal()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};