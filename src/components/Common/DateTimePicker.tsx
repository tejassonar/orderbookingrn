import React from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface DatePickerProps {
  date: Date;
  showDate: boolean;
  setShowDate: React.Dispatch<React.SetStateAction<boolean>>;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  id: string;
}
const DateTimePicker = ({
  date,
  showDate,
  setShowDate,
  setDate,
  id,
}: DatePickerProps) => {
  return (
    <DateTimePickerModal
      headerTextIOS={`Pick a Date`}
      cancelTextIOS={`Cancel`}
      confirmTextIOS={`Confirm`}
      isVisible={showDate}
      maximumDate={new Date(new Date().setDate(new Date().getDate() + 1))}
      minimumDate={new Date(2006, 0, 1)}
      testID={id}
      timeZoneOffsetInMinutes={330}
      // date={new Date(date) || new Date()}
      value={date ? new Date(date) : null}
      mode={'date'}
      is24Hour={true}
      display="default"
      onConfirm={date => {
        console.log(date, 'date');
        setDate(date);
        setShowDate(false);
      }}
      onCancel={() => {
        setShowDate(false);
      }}
    />
  );
};

export default DateTimePicker;
