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
import logo from './images/logo.png';

const totalRooms = Object.values(ROOMS_PER_FLOOR).reduce((sum, num) => sum + num, 0);

function App() {
  const [selectedFloor, setSelectedFloor] = useState(FLOORS[0]);
  const [roomData, setRoomData] = useState<Record<string, RoomData>>({});
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [showCheckInForm, setShowCheckInForm] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isSubscriptionValid, setIsSubscriptionValid] = useState(true);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [expiryDate, setExpiryDate] = useState<string | null>(null);

  const fetchExpiryDate = async () => {
    try {
      const response =  await fetch('https://raw.githubusercontent.com/brewnok/managerji/refs/heads/main/expiry', {
        cache: 'no-cache',
      });
      console.log("Checked expiry date");
      const expiryDateText =  await response.text();
      const expiryDate = new Date(expiryDateText.trim());
      const currentDate = new Date();

      // Calculate the difference in days
      const timeDifference = expiryDate.getTime() - currentDate.getTime();
      const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
      console.log(expiryDate);
      console.log(currentDate);
      console.log(daysDifference);
      if (daysDifference < 0) {
        setIsSubscriptionValid(false);
        setExpiryDate(expiryDate.toLocaleDateString());
      } else {
        setDaysLeft(daysDifference);
        setExpiryDate(expiryDate.toLocaleDateString());
        setIsSubscriptionValid(true);
      }
    } catch (error) {
      console.error('Error fetching expiry date:', error);
      setIsSubscriptionValid(false);
    }
  };

  useEffect(() => {
    // Fetch expiry date immediately on component mount
    fetchExpiryDate();

    // Set up an interval to fetch expiry date every 5 hours
    const intervalId = setInterval(fetchExpiryDate, 5000); // 5 hours in milliseconds

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const data = loadRoomData();
    setRoomData(data);
  }, []);

  const handleRoomClick = (roomNumber: string) => {
    if (!isSubscriptionValid) return;
    setSelectedRoom(roomNumber);
    if (!roomData[roomNumber]?.isOccupied) {
      setShowCheckInForm(true);
    }
  };

  const handleCheckIn = (details: PersonalDetails) => {
    if (!isSubscriptionValid) return;
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
    if (!isSubscriptionValid) return;
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
    if (!isSubscriptionValid) return;
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
    if (!isSubscriptionValid) return;
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
    if (!isSubscriptionValid) return;
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

  const occupiedRooms = Object.values(roomData).filter((room) => room.isOccupied).length;
  const freeRooms = totalRooms - occupiedRooms;

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">

      {daysLeft !== null && (
        <div className="fixed top-0 left-0 p-6 bg-white shadow-md rounded-br-lg">
          <div className="text-center">
            <div className="text-6xl font-bold text-blue-600">{daysLeft}</div>
            <div className="text-lg font-semibold text-gray-700">Days Left</div>
            {expiryDate && (
              <div className="text-md text-black-500">Expiry: {expiryDate}</div>
            )}
          </div>
        </div>
      )}

      {!isSubscriptionValid && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
            <h2 className="text-2xl font-bold mb-6">Subscription Ended</h2>
            <p className="text-gray-700">Please renew to continue using the app.</p>
          </div>
        </div>
      )}

      {/* Total Occupied and Free Rooms (Top Right Corner) */}
      <div className="fixed top-0 right-0 p-9 bg-white shadow-md rounded-bl-lg">
        <div className="flex space-x-4">
          <div className="text-center">
            <div className="text-6xl font-bold text-green-600">{freeRooms}</div>
            <div className="text-md font-semibold text-gray-700">Available</div>
          </div>
          <div className="text-center">
            <div className="text-6xl font-bold text-red-600">{occupiedRooms}</div>
            <div className="text-md font-semibold text-gray-700">Occupied</div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        <br />
        <div className="flex justify-center">
          <img src={logo} alt="Hotel Logo" className="h-20" />
        </div>
        <br />
        <hr />
        <br />
        <FloorSelector selectedFloor={selectedFloor} onFloorChange={setSelectedFloor} />
        <br />
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

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 w-full text-black p-4 text-center">
        <div>
          <span>Powered by </span>
          <img src={logo} alt="Logo" className="inline h-6 mx-2" />
          <span>a product by brewnok</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
