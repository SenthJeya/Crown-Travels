import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import React from 'react';

const CustomButton = ({ title, handlePress, containerStyles, textStyles, isLoading }) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[
        styles.button,
        containerStyles,
        isLoading && styles.disabled,
      ]}
      disabled={isLoading}
    >
      <Text style={[styles.text, textStyles]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#662483', 
    borderRadius: 10,
    minHeight: 62,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold', 
    // fontWeight: 'bold',
    fontSize: 18,
  },
});

export default CustomButton;
