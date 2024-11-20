import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePicker = ({ onDateTimeChange, title, otherStyles, placeholder }) => {
  const [dateTime, setDateTime] = useState(null);
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('date');

  const onChange = (event, selectedDateTime) => {
    const currentDateTime = selectedDateTime || dateTime;
    setShow(false);
    setDateTime(currentDateTime);
    onDateTimeChange(currentDateTime);
  };

  const showPicker = (pickerMode) => {
    setMode(pickerMode);
    setShow(true);
  };

  const minimumDate = new Date();
  minimumDate.setDate(minimumDate.getDate() + 2);

  const maximumDate = new Date(minimumDate);
  maximumDate.setDate(maximumDate.getDate() + 20);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-lg font-pbold text-black">{title}</Text>
      <TouchableOpacity
        className="border-4 border-black w-full h-16 px-4 bg-white rounded-3xl focus:border-secondary items-center"
        onPress={() => showPicker('date')}
        style={styles.input}
      >
        <Text style={[styles.text, !dateTime && styles.placeholder]}>
          {dateTime ? dateTime.toDateString() : placeholder} {/* Show placeholder if no date is selected */}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="border-4 border-black w-full h-16 px-4 bg-white rounded-3xl focus:border-secondary items-center"
        onPress={() => showPicker('time')}
        style={styles.input}
      >
        <Text style={[styles.text, !dateTime && styles.placeholder]}>
          {dateTime ? dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : placeholder} {/* Show placeholder if no time is selected */}
        </Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={dateTime || minimumDate}
          mode={mode}
          display="default"
          onChange={onChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 15,
    borderWidth: 4,
    borderColor: '#000000',
    borderRadius: 10,
    marginVertical: 5,
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  placeholder: {
    color: 'gray', 
  },
});

export default DatePicker;
