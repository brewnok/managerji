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
  const getRoomNumber = (index: number) =>
    `${floor.split(' ')[0][0]}${floor.split(' ')[1][0]}R${index + 1}`;

  const roomsCount = ROOMS_PER_FLOOR[floor] || 0; // Default to 0 if the floor is not defined

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
              h-24 rounded-lg shadow-md flex items-center justify-center
              ${isOccupied ? 'bg-red-500' : 'bg-green-500'}
              hover:opacity-90 transition-opacity
            `}
          >
            <span className="text-white font-semibold">{roomNumber}</span>
          </button>
        );
      })}
    </div>
  );
};
