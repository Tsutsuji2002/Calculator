import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Header from './components/Header';
import Display from './components/Display';
import Keypad from './components/Keypad';
import { CalculatorProvider } from './contexts/CalculatorContext';
import { SafeAreaView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const App = () => {
  const { width } = Dimensions.get('window');

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CalculatorProvider>
        <View style={styles.container}>
          <Header width={width} />
          <Display width={width} />
          <Keypad width={width} />
        </View>
      </CalculatorProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: wp('1%'),
    marginTop: wp('8%'),
  },
});

export default App;
