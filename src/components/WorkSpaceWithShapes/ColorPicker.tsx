import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";

const ColorPicker = ({ shapeInfo, onColorChange, onCancel }) => {
  const [color, setColor] = useState(shapeInfo.color);

  return (
    <div className="p-2 bg-white shadow-lg rounded-md border w-fit">
      <HexColorPicker color={color} onChange={setColor} />
      <div className="flex justify-end gap-2 mt-2">
        <button
          onClick={onCancel}
          className="px-2 py-1 text-sm bg-gray-200 rounded"
        >
          İptal
        </button>
        <button
          onClick={() => onColorChange(shapeInfo.id, color)}
          className="px-2 py-1 text-sm bg-blue-500 text-white rounded"
        >
          Tamam
        </button>
      </div>
    </div>
  );
};
export default ColorPicker;
