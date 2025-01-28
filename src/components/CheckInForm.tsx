import React, { useState } from 'react';
import { PersonalDetails, Adult } from '../types';

interface CheckInFormProps {
  onSubmit: (details: PersonalDetails) => void;
  onCancel: () => void;
}

export const CheckInForm: React.FC<CheckInFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<PersonalDetails>({
    name: '',
    phone: '',
    aadhaar: '',
    numberOfAdults: 1,
    adults: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleAdultNameChange = (index: number, name: string) => {
    const newAdults = [...formData.adults];
    newAdults[index] = { name };
    setFormData({ ...formData, adults: newAdults });
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;

    // Allow only digits and ensure the length is at most 10 digits
    if (/^\d{0,10}$/.test(value)) {
      setFormData({ ...formData, phone: value });
    }
  };

  const handleAadhaarChange = (e) => {
    const value = e.target.value;

    // Allow only digits and ensure the length is at most 12 digits
    if (/^\d{0,12}$/.test(value)) {
      setFormData({ ...formData, aadhaar: value });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          style={{ paddingLeft: '10px', paddingTop: '5px', paddingBottom: '5px'}}
          className="mt-1 block w-full border-2 border-gray-500 bg-white shadow-sm focus:border-blue-600 focus:ring-blue-600"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="number"
          required
          value={formData.phone}
          onChange={handlePhoneChange}
          style={{ paddingLeft: '10px', paddingTop: '5px', paddingBottom: '5px'}}
          className="mt-1 block w-full border-2 border-gray-500 bg-white shadow-sm focus:border-blue-600 focus:ring-blue-600"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Aadhaar</label>
        <input
          type="number"
          required
          value={formData.aadhaar}
          onChange={handleAadhaarChange}
          style={{ paddingLeft: '10px', paddingTop: '5px', paddingBottom: '5px'}}
          className="mt-1 block w-full border-2 border-gray-500 bg-white shadow-sm focus:border-blue-600 focus:ring-blue-600"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Number of Adults</label>
        <input
          type="number"
          min="1"
          required
          value={formData.numberOfAdults}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            setFormData({
              ...formData,
              numberOfAdults: value,
              adults: Array(value - 1).fill({ name: '' }),
            });
          }}
          style={{ paddingLeft: '10px', paddingTop: '5px', paddingBottom: '5px'}}
          className="mt-1 block w-full border-2 border-gray-500 bg-white shadow-sm focus:border-blue-600 focus:ring-blue-600"
        />
      </div>

      {formData.adults.map((_, index) => (
        <div key={index}>
          <label className="block text-sm font-medium text-gray-700">
            Adult {index + 2} Name
          </label>
          <input
            type="text"
            required
            value={formData.adults[index]?.name || ''}
            onChange={(e) => handleAdultNameChange(index, e.target.value)}
            className="mt-1 block w-full border-2 border-gray-500 bg-white shadow-sm focus:border-blue-600 focus:ring-blue-600"
            style={{ paddingLeft: '10px', paddingTop: '5px', paddingBottom: '5px'}}

          />
        </div>
      ))}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Check In
        </button>
      </div>
    </form>
  );
};