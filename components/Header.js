import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CalculatorContext } from '../contexts/CalculatorContext';

const themes = {
  dark: {
    background: '#1c1c1e',
    text: '#fff',
    iconColor: '#ff3b30',
  },
  light: {
    background: '#fff',
    text: '#000',
    iconColor: '#000',
  },
};

const Header = () => {
  const { theme, handleThemeChange, isRadians } = useContext(CalculatorContext);

  return (
    <View style={[styles.header, { backgroundColor: themes[theme].background }]}>
      <TouchableOpacity onPress={handleThemeChange}>
        <Icon name={theme === 'dark' ? 'sunny' : 'moon'} size={24} color={themes[theme].iconColor} />
      </TouchableOpacity>
      <Text style={[styles.titleText, { color: themes[theme].text }]}>Calculator</Text>
      <Text style={[styles.modeText, { color: themes[theme].text }]}>{isRadians ? 'RAD' : 'DEG'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modeText: {
    fontSize: 16,
  },
});

export default Header;