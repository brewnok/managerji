import React from 'react';
import { RoomData } from '../types';
import { ROOMS_PER_FLOOR } from '../data/constants';

interface RoomGridProps {
  floor: string;
  roomData: Record<string, RoomData>;
  onRoomClick: (roomNumber: string) => void;
}

export const RoomGrid: React.FC<RoomGridProps> = ({
  floor,
  roomData,
  onRoomClick,
}) => {
  const getRoomNumber = (index: number) => {
    const floorNumber = floor.match(/\d+/)?.[0] || '0'; // Extract floor number
    return `${floorNumber}${String(index + 1).padStart(3, '0')}`; // Format as 1001, 1002, etc.
  };

  const roomsCount = ROOMS_PER_FLOOR[floor] || 0;

  return (
    <div className="grid grid-cols-5 gap-4">
      {Array.from({ length: roomsCount }).map((_, index) => {
        const roomNumber = getRoomNumber(index);
        const room = roomData[roomNumber];
        const isOccupied = room?.isOccupied || false;

        return (
          <button
            key={roomNumber}
            onClick={() => onRoomClick(roomNumber)}
            className={`
              h-36 rounded-lg shadow-md flex flex-col items-center justify-center
              ${isOccupied ? 'bg-red-500' : 'bg-green-500'}
              hover:opacity-90 transition-opacity
            `}
          >
            <div className="w-36 h-auto flex items-center justify-center">
              <br />
              <img
                src={isOccupied ? 'src/assets/icon-occupied.png' : 'src/assets/icon-free.png'}
                alt={isOccupied ? 'Occupied Room' : 'Free Room'}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <span className="text-white font-semibold mt-0.5">{roomNumber}</span>
          </button>
        );
      })}
    </div>
  );
};
