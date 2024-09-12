import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import Button from './Button';
import { CalculatorContext } from '../contexts/CalculatorContext';

const Keypad = () => {
  const { handleInput, isRadians } = useContext(CalculatorContext);

  return (
    <View style={styles.keypad}>
      <View style={styles.row}>
        <Button text="SIN" onPress={() => handleInput('SIN')} />
        <Button text="COS" onPress={() => handleInput('COS')} />
        <Button text="TAN" onPress={() => handleInput('TAN')} />
        <Button text="COT" onPress={() => handleInput('COT')} />
        <Button text="RAD/DEG" onPress={() => handleInput('RAD/DEG')} />
      </View>
      <View style={styles.row}>
        <Button text="LOG" onPress={() => handleInput('LOG10')} />
        <Button text="LN" onPress={() => handleInput('LN')} />
        <Button text="e^x" onPress={() => handleInput('EXP')} />
        <Button text="√" onPress={() => handleInput('SQRT')} />
        <Button text="^" onPress={() => handleInput('POWER')} />
      </View>
      <View style={styles.row}>
        <Button text="7" onPress={() => handleInput('7')} />
        <Button text="8" onPress={() => handleInput('8')} />
        <Button text="9" onPress={() => handleInput('9')} />
        <Button text="←" onPress={() => handleInput('LEFT')} />
        <Button text="→" onPress={() => handleInput('RIGHT')} />
      </View>
      <View style={styles.row}>
        <Button text="4" onPress={() => handleInput('4')} />
        <Button text="5" onPress={() => handleInput('5')} />
        <Button text="6" onPress={() => handleInput('6')} />
        <Button text="+" color="#ff9500" onPress={() => handleInput('+')} />
        <Button text="-" color="#ff9500" onPress={() => handleInput('-')} />
      </View>
      <View style={styles.row}>
        <Button text="1" onPress={() => handleInput('1')} />
        <Button text="2" onPress={() => handleInput('2')} />
        <Button text="3" onPress={() => handleInput('3')} />
        <Button text="×" color="#ff9500" onPress={() => handleInput('*')} />
        <Button text="÷" color="#ff9500" onPress={() => handleInput('/')} />
      </View>
      <View style={styles.row}>
        <Button text="0" flex={2} onPress={() => handleInput('0')} />
        <Button text="." onPress={() => handleInput('.')} />
        <Button text="DEL" color="#ff3b30" onPress={() => handleInput('DEL')} />
        <Button text="AC" color="#ff3b30" onPress={() => handleInput('AC')} />
        <Button text="=" color="#ff9500" onPress={() => handleInput('=')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  keypad: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

export default Keypad;