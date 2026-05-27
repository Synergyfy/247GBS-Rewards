import React from 'react';
import ToolTip from './ToolTip';
import 'react-datepicker/dist/react-datepicker.css';
import DateTimePicker from './datePicker';

interface DateRangeFormProps {
  activeFrom: Date;
  expires: Date;
  setActiveFrom: (val: Date) => void;
  setExpires: (val: Date) => void;
}

const DateRangeForm: React.FC<DateRangeFormProps> = ({
  activeFrom,
  expires,
  setActiveFrom,
  setExpires,
}) => {
  return (
    <div className="space-y-6">
      <p className="text-gray-600">
        The date range specifies how long this reward is valid for.
      </p>
      <div>
         <label className="mb-1 flex items-center gap-2 font-medium text-gray-700 text-sm">
          Active From (required)
          <ToolTip content="When is the starting date for this reward?" />
        </label>
        <div className="border border-gray-300 rounded-md p-1 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500">
            <DateTimePicker date={activeFrom} setDate={setActiveFrom} />
        </div>
      </div>

      <div>
         <label className="mb-1 flex items-center gap-2 font-medium text-gray-700 text-sm">
          Expires (required)
          <ToolTip content="At what date and time will this reward stop being valid?" />
        </label>
        <div className="border border-gray-300 rounded-md p-1 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500">
            <DateTimePicker date={expires} setDate={setExpires} />
        </div>
      </div>
    </div>
  );
};

export default DateRangeForm;
