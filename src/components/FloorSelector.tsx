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
      <label className="block text-sm font-medium text-gray-700 mb-4">
        Select Floor
      </label>
      <div className="flex flex-wrap gap-4">
        {FLOORS.map((floor) => (
          <button
            key={floor}
            onClick={() => onFloorChange(floor)}
            className={`px-4 py-2 rounded-md shadow-md text-white font-medium transition-all ${
              selectedFloor === floor
                ? "bg-blue-500 border-blue-600"
                : "bg-gray-300 border-gray-400 hover:bg-gray-400"
            }`}
          >
            {floor}
          </button>
        ))}
      </div>
    </div>
  );
};
