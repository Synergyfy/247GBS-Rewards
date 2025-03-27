'use client';

import React, { FC } from 'react';
import { MdCancel } from 'react-icons/md';

export interface OptionType {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: OptionType[];
  selectedOptions: string[];
  setSelectedOptions: (selectedOptions: string[]) => void;
  text?: string;
}

const MultiSelect: FC<MultiSelectProps> = ({
  options,
  selectedOptions,
  setSelectedOptions,
  text,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    if (selectedOptions.includes(value)) return;
    setSelectedOptions([...selectedOptions, value]);
  };

  const findOptionLabel = (value: string) => {
    const option = options.find(option => option.value === value);
    return option ? option.label : '';
  };

  const handleDelete = (id: string) => {
    const newOptions = selectedOptions.filter(option => option !== id);
    setSelectedOptions(newOptions);
  };

  return (
    <section className="py-4 w-full">
      <select
        onChange={handleChange}
        value={''}
        className="w-full outline-none border-b border-black"
      >
        <option>{text || 'Select an option'}</option>
        {options.map((item, i) => {
          return (
            <option key={i} value={item.value}>
              {item.label}
            </option>
          );
        })}
      </select>
      <div className="mt-4 flex gap-2 flex-wrap">
        {selectedOptions.length > 0 &&
          selectedOptions.map((option: string, i: number) => {
            return (
              <div
                key={i}
                className="px-3 py-1 min-w-[4rem] w-fit bg-slate-400 rounded-lg font-medium flex items-center justify-between gap-2"
              >
                <p>{findOptionLabel(option)}</p>
                <MdCancel onClick={() => handleDelete(option)} />
              </div>
            );
          })}
      </div>
    </section>
  );
};

export default MultiSelect;
