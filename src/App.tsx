import React, { useState, useEffect } from 'react';
import { FloorSelector } from './components/FloorSelector';
import { RoomGrid } from './components/RoomGrid';
import { CheckInForm } from './components/CheckInForm';
import { ServiceManager } from './components/ServiceManager';
import { CheckoutModal } from './components/CheckoutModal';
import { FLOORS } from './data/constants';
import { RoomData, PersonalDetails, Service } from './types';
import { loadRoomData, saveRoomData, saveCheckoutData } from './utils/storage';
import { ROOMS_PER_FLOOR } from './data/constants';

// Import the image
import logo from './images/logo.png';

const totalRooms = Object.values(ROOMS_PER_FLOOR).reduce((sum, num) => sum + num, 0);
console.log(totalRooms);

function App() {
  const [selectedFloor, setSelectedFloor] = useState(FLOORS[0]);
  const [roomData, setRoomData] = useState<Record<string, RoomData>>({});
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [showCheckInForm, setShowCheckInForm] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  useEffect(() => {
    const data = loadRoomData();
    setRoomData(data);
    // console.log(data);
  }, []);

  const handleRoomClick = (roomNumber: string) => {
    setSelectedRoom(roomNumber);
    if (!roomData[roomNumber]?.isOccupied) {
      setShowCheckInForm(true);
    }
  };

  const handleCheckIn = (details: PersonalDetails) => {
    if (selectedRoom) {
      const newRoomData = {
        ...roomData,
        [selectedRoom]: {
          roomNumber: selectedRoom,
          floor: selectedFloor,
          isOccupied: true,
          checkInTime: new Date().toISOString(),
          personalDetails: details,
          services: [],
        },
      };
      setRoomData(newRoomData);
      saveRoomData(newRoomData);
      setShowCheckInForm(false);
    }
  };

  const handleAddService = (service: Service) => {
    if (selectedRoom && roomData[selectedRoom]) {
      const newRoomData = {
        ...roomData,
        [selectedRoom]: {
          ...roomData[selectedRoom],
          services: [...roomData[selectedRoom].services, service],
        },
      };
      setRoomData(newRoomData);
      saveRoomData(newRoomData);
    }
  };

  const handleDeleteService = (serviceId: string) => {
    if (selectedRoom && roomData[selectedRoom]) {
      const newRoomData = {
        ...roomData,
        [selectedRoom]: {
          ...roomData[selectedRoom],
          services: roomData[selectedRoom].services.filter(
            (service) => service.id !== serviceId
          ),
        },
      };
      setRoomData(newRoomData);
      saveRoomData(newRoomData);
    }
  };

  const handleEditPersonalDetails = (details: PersonalDetails) => {
    if (selectedRoom && roomData[selectedRoom]) {
      const newRoomData = {
        ...roomData,
        [selectedRoom]: {
          ...roomData[selectedRoom],
          personalDetails: details,
        },
      };
      setRoomData(newRoomData);
      saveRoomData(newRoomData);
    }
  };

  const handleCheckout = async () => {
    if (selectedRoom && roomData[selectedRoom]) {
      const checkoutData = {
        ...roomData[selectedRoom],
        checkOutTime: new Date().toISOString(),
        totalBill: roomData[selectedRoom].services.reduce(
          (total, service) => total + service.price * service.quantity,
          0
        ),
      };

      try {
        await saveCheckoutData(checkoutData);
        const newRoomData = { ...roomData };
        delete newRoomData[selectedRoom];
        setRoomData(newRoomData);
        saveRoomData(newRoomData);
        setShowCheckoutModal(false);
        setSelectedRoom(null);
      } catch (error) {
        console.error('Error during checkout:', error);
        alert('Failed to complete checkout. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <br />
        {/* Replace the text with the image */}
        <div className="flex justify-center">
          <img src={logo} alt="Hotel Logo" className="h-20" />
        </div>
  
        {/* Occupied and Free Rooms Summary */}
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
          <div className="text-lg font-semibold text-red-600">
            Total Occupied Rooms:{" "}
            {Object.values(roomData).filter((room) => room.isOccupied).length}
          </div>
          <div className="text-lg font-semibold text-green-600">
            Total Free Rooms:{" "}
            {totalRooms - Object.values(roomData).filter((room) => room.isOccupied).length}
          </div>
        </div>
  
        <FloorSelector selectedFloor={selectedFloor} onFloorChange={setSelectedFloor} />
  
        <RoomGrid
          floor={selectedFloor}
          roomData={roomData}
          onRoomClick={handleRoomClick}
        />
  
        {showCheckInForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold mb-6">Check In</h2>
              <CheckInForm
                onSubmit={handleCheckIn}
                onCancel={() => {
                  setShowCheckInForm(false);
                  setSelectedRoom(null);
                }}
              />
            </div>
          </div>
        )}
  
        {selectedRoom && roomData[selectedRoom]?.isOccupied && !showCheckoutModal && (
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Room {selectedRoom}</h2>
              <button
                onClick={() => setShowCheckoutModal(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Checkout
              </button>
            </div>
            <ServiceManager
              personalDetails={roomData[selectedRoom].personalDetails!}
              services={roomData[selectedRoom].services}
              onAddService={handleAddService}
              onEditPersonalDetails={handleEditPersonalDetails}
              onDeleteService={handleDeleteService}
            />
          </div>
        )}
  
        {showCheckoutModal && selectedRoom && roomData[selectedRoom] && (
          <CheckoutModal
            roomData={roomData[selectedRoom]}
            onConfirm={handleCheckout}
            onCancel={() => setShowCheckoutModal(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;