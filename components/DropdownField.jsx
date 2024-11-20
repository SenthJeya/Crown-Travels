import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const DropdownField = ({ title, value, placeholder, options, handleChange, otherStyles }) => {
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-lg font-pbold text-black">{title}</Text>
      <View className="border-4 border-black w-full h-16 px-4 bg-white rounded-3xl focus:border-secondary items-center">
        <RNPickerSelect
          value={value}
          onValueChange={(value) => handleChange(value)}
          items={options}
          placeholder={{ label: placeholder, value: null }}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false} // Disable native Android picker style
        />
      </View>
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#000000', // Color for selected item
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  inputAndroid: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#000000', // Color for selected item
    paddingHorizontal: 10,
    paddingVertical: 8,
    paddingTop:15,
  },
 
  placeholder: {
    color: '#7B7B8B',
    fontFamily: 'Poppins-SemiBold',
    paddingTop:15,
  },

  
});

export default DropdownField;
