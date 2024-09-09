import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { CalculatorContext } from '../contexts/CalculatorContext';

const themes = {
  dark: {
    backgroundColor: '#333',
    textColor: '#fff',
  },
  light: {
    backgroundColor: '#ddd',
    textColor: '#000',
  },
};

const Button = ({ text, onPress, color, flex = 1 }) => {
  const { theme } = useContext(CalculatorContext);

  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: color || themes[theme].backgroundColor, flex }]} 
      onPress={onPress}
    >
      <Text style={[styles.buttonText, { color: themes[theme].textColor }]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
    margin: 2,
  },
  buttonText: {
    fontSize: 18,
  },
});

export default Button;