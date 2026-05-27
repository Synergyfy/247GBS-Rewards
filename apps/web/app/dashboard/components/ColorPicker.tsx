'use client';

import React, { useRef, useState } from 'react';
import { HexColorPicker } from 'react-colorful';

interface ColorPickerProp {
  color: string;
  onChange: (name: string, color: string) => void; // Add onChange prop
  label: string;
  name: string; // Add name prop to identify the field
}

const ColorPicker: React.FC<ColorPickerProp> = ({
  color,
  onChange,
  label,
  name,
}) => {
  const inputRef = useRef<HTMLDivElement | null>(null);
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const handleFocus = () => {
    setIsPickerVisible(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!inputRef.current?.contains(document.activeElement)) {
        setIsPickerVisible(false);
      }
    }, 100);
  };

  const handleColorChange = (newColor: string) => {
    onChange(name, newColor); // Call onChange with the field name and new color
  };

  return (
    <div ref={inputRef} style={{ position: 'relative' }} className="mb-[2rem]">
      <label className="text-gray-500 text-sm">{label}</label>
      <div className="flex gap-1">
        <div className="w-[8%] self-end">
          <div
            style={{
              width: '30px',
              height: '30px',
              backgroundColor: color,
            }}
            className="border rounded"
          ></div>
        </div>

        <input
          type="text"
          value={color}
          onChange={e => handleColorChange(e.target.value)} // Update color on input change
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full p-2 border-b-2 border-[#838383] focus:border-[#2D3DFF] outline-none"
        />

        {isPickerVisible && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              zIndex: 100,
            }}
          >
            <HexColorPicker color={color} onChange={handleColorChange} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;
