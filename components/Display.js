import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CalculatorContext } from '../contexts/CalculatorContext';

const themes = {
  dark: {
    background: '#000',
    text: '#fff',
  },
  light: {
    background: '#f0f0f0',
    text: '#000',
  },
};

const Display = () => {
  const { 
    display, 
    expression, 
    cursorPosition, 
    setCursorPosition, 
    activeFunction, 
    showResult, 
    setShowResult,
    handleInput,
    theme
  } = useContext(CalculatorContext);
  const [currentLine, setCurrentLine] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (expression === '') {
      setCurrentLine(0);
      setShowResult(false);
    }
  }, [expression]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  const handleUpDown = (direction) => {
    if (direction === 'UP' && currentLine > 0) {
      setCurrentLine(currentLine - 1);
    } else if (direction === 'DOWN' && currentLine < 1 && showResult) {
      setCurrentLine(currentLine + 1);
    }
    handleInput(direction);
  };

  const renderExpression = () => {
    let displayExpression = expression;
    const cursor = showCursor ? '|' : ' ';
    
    if (activeFunction) {
      const lastOpenParenIndex = displayExpression.lastIndexOf('(');
      if (lastOpenParenIndex !== -1) {
        displayExpression = 
          displayExpression.slice(0, cursorPosition) + 
          cursor + 
          displayExpression.slice(cursorPosition);
      }
    } else {
      displayExpression = 
        displayExpression.slice(0, cursorPosition) + 
        cursor + 
        displayExpression.slice(cursorPosition);
    }
    return displayExpression;
  };

  return (
    <View style={[styles.display, { backgroundColor: themes[theme].background }]}>
      <Text style={[styles.expressionText, { color: themes[theme].text }]}>
        {currentLine === 0 || !showResult ? renderExpression() : expression}
      </Text>
      <Text style={[styles.displayText, { color: themes[theme].text }]}>
        {(currentLine === 1 || showResult) ? display : ''}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  display: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    minHeight: 120,
  },
  expressionText: {
    fontSize: 24,
    color: '#666',
    fontFamily: 'monospace',
  },
  displayText: {
    fontSize: 48,
    color: '#000',
  },
});

export default Display;