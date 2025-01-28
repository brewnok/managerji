import { RoomData, CheckoutData } from '../types';

export const saveRoomData = (roomData: Record<string, RoomData>) => {
  localStorage.setItem('room_checkin_info', JSON.stringify(roomData));
};

export const loadRoomData = (): Record<string, RoomData> => {
  const data = localStorage.getItem('room_checkin_info');
  console.log(data);
  return data ? JSON.parse(data) : {};
};

export const saveCheckoutData = async (checkoutData: CheckoutData) => {
  try {
    const response = await fetch('/api/saveCheckout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkoutData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save checkout data');
    }
    alert("Checkout Done");
  } catch (error) {
    console.error('Error saving checkout data:', error);
    throw error;
  }
};