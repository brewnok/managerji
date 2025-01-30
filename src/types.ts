export interface Adult {
  name: string;
}

export interface PersonalDetails {
  name: string;
  phone: string;
  aadhaar: string;
  numberOfAdults: number;
  adults: Adult[];
}

export interface Service {
  id: string;
  name: string;
  price: number;
  quantity: number;
  date: string;
  type: 'food' | 'water' | 'other';
}

export interface RoomData {
  roomNumber: string;
  floor: string;
  isOccupied: boolean;
  checkInTime?: string;
  checkOutTime?: string;
  personalDetails?: PersonalDetails;
  services: Service[];
  checkoutHistory?: CheckoutData[];
}

export interface CheckoutData extends RoomData {
  totalBill: number;
  checkOutTime: string;
}