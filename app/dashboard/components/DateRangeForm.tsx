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
      <p className="text-lg text-grey-600">
        The date range spcifies how long this reward is valid for
      </p>
      <div>
        <label className=" mb-1 flex items-center gap-2">
          Active From (required)
          <ToolTip content="When is the starting date for this reward?" />
        </label>
        <DateTimePicker date={activeFrom} setDate={setActiveFrom} />
      </div>

      <div>
        <label className=" mb-1 flex items-center gap-2">
          Expires (required)
          <ToolTip content="At what date and time will this reward stop being valid?" />
        </label>
        <label className="block mb-1"></label>
        <DateTimePicker date={expires} setDate={setExpires} />
      </div>
    </div>
  );
};

export default DateRangeForm;
