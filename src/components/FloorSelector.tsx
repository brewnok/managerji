import React from "react";
import { FLOORS } from "../data/constants";

interface FloorSelectorProps {
  selectedFloor: string;
  onFloorChange: (floor: string) => void;
}

export const FloorSelector: React.FC<FloorSelectorProps> = ({
  selectedFloor,
  onFloorChange,
}) => {
  return (
    <div className="mb-6">
       {/* <label className="block text-lg font-semibold text-gray-800 mb-4">
        Select Floor
      </label> */}
      <div className="flex gap-4">
        {FLOORS.map((floor) => (
          <button
            key={floor}
            onClick={() => onFloorChange(floor)}
            className={`flex-1 px-4 py-2 rounded-md shadow-md text-white font-medium transition-all ${
              selectedFloor === floor
                ? "bg-blue-500 border-blue-600"
                : "bg-gray-300 border-gray-400 hover:bg-gray-400 !text-black"
            }`}
          >
            {floor}
          </button>
        ))}
      </div>
    </div>
  );
};
