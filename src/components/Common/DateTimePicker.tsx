import React from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface DatePickerProps {
  date: Date | undefined;
  showDate: boolean;
  setShowDate: React.Dispatch<React.SetStateAction<boolean>>;
  // setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  id: string;
  onConfirm: (date: Date) => void;
}
const DateTimePicker = ({
  date,
  showDate,
  setShowDate,
  // setDate,
  id,
  onConfirm,
}: DatePickerProps) => {
  // console.log(date, id, 'date');

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
        onConfirm(date);
      }}
      onCancel={() => {
        setShowDate(false);
      }}
    />
  );
};

export default DateTimePicker;
