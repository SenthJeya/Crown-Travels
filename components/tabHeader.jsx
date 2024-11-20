import { View, Text, StyleSheet, StatusBar,Platform } from 'react-native';
import React from 'react';

const TabHeader = ({title}) => {
  

  return (
    <View style={styles.header}>
        <Text style={styles.headerText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DAA621',
    height: 80,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerText: {
    color: '#662483',
    fontSize: 24,
    fontFamily: 'Poppins-ExtraBold',
    paddingLeft: 10,
  },
})
export default TabHeader;
