import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DateTimePickerType {
  date: Date;
  setDate: (date: Date) => void;
  showTime?: boolean;
}

const DateTimePicker: React.FC<DateTimePickerType> = ({ date, setDate, showTime = true }) => {
  return (
    <div>
      <DatePicker
        selected={date}
        onChange={date => {
          if (date) setDate(date);
        }}
        showTimeSelect={showTime}
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat={showTime ? "MMMM d, yyyy h:mm aa" : "MMMM d, yyyy"}
        className="w-[28rem] h-[2rem] border-b outline-blue-600 p-2"
      />
    </div>
  );
};

export default DateTimePicker;
