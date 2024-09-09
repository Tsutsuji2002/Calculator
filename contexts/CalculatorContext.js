import React, { createContext, useState } from 'react';

export const CalculatorContext = createContext();

export const CalculatorProvider = ({ children }) => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [theme, setTheme] = useState('dark');
  const [memory, setMemory] = useState(0);
  const [operator, setOperator] = useState(null);
  const [prevValue, setPrevValue] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [isRadians, setIsRadians] = useState(true);
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [isAlphaActive, setIsAlphaActive] = useState(false);
  const [answer, setAnswer] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [activeFunction, setActiveFunction] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleThemeChange = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleInput = (input) => {
    let newExpression = expression;
    let newCursorPosition = cursorPosition;

    const insertFunction = (func) => {
      newExpression = insertAtCursor(`${func}()`);
      newCursorPosition = cursorPosition + func.length + 1;
      setActiveFunction(func);
    };

    const isFunctionAtCursor = (pos) => {
      const funcMatch = newExpression.slice(0, pos).match(/(sin|cos|tan|cot|log10|ln|exp|sqrt)\($/);
      return funcMatch ? funcMatch[0] : null;
    };

    const findMatchingParenthesis = (pos) => {
      let depth = 0;
      for (let i = pos; i < newExpression.length; i++) {
        if (newExpression[i] === '(') depth++;
        if (newExpression[i] === ')') depth--;
        if (depth === 0) return i;
      }
      return -1;
    };

    switch (input) {
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
      case '.':
        newExpression = insertAtCursor(input);
        newCursorPosition = cursorPosition + 1;
        break;
      case '+':
      case '-':
      case '*':
      case '/':
        newExpression = insertAtCursor(input);
        newCursorPosition = cursorPosition + 1;
        break;
      case 'POWER':
        newExpression = insertAtCursor('^');
        newCursorPosition = cursorPosition + 1;
        break;
      case 'SIN':
      case 'COS':
      case 'TAN':
      case 'COT':
      case 'LOG10':
      case 'LN':
      case 'EXP':
      case 'SQRT':
        insertFunction(input.toLowerCase());
        break;
      case 'LEFT':
        const funcAtLeft = isFunctionAtCursor(newCursorPosition);
        if (funcAtLeft) {
          newCursorPosition -= funcAtLeft.length + 1;
        } else if (newCursorPosition > 0) {
          newCursorPosition = Math.max(0, cursorPosition - 1);
        }
        break;

      case 'RIGHT':
        const nextChar = newExpression[cursorPosition];
        const funcAtCursor = isFunctionAtCursor(cursorPosition);
        if (funcAtCursor) {
          newCursorPosition += funcAtCursor.length + 1; 
        } else if (nextChar === '(') {
          const matchingParen = findMatchingParenthesis(cursorPosition);
          if (matchingParen !== -1) {
            newCursorPosition = matchingParen + 1;
          } else {
            newCursorPosition = Math.min(expression.length, cursorPosition + 1);
          }
        } else {
          newCursorPosition = Math.min(expression.length, cursorPosition + 1);
        }
        break;
      case 'UP':
      case 'DOWN':
        break;
      case '=':
        try {
          const evalExpression = newExpression.replace(/(\w+)\((.*?)\)/g, (match, func, args) => {
            return calculateFunction(func, parseFloat(args));
          });
          const result = customEval(evalExpression);
          newDisplay = String(result);
          setAnswer(result);
          setShowResult(true);
          setActiveFunction(null);
        } catch (error) {
          newDisplay = 'Error';
        }
        break;
      case 'AC':
        newExpression = '';
        newCursorPosition = 0;
        newDisplay = '0';
        setShowResult(false);
        setActiveFunction(null);
        break;
      case 'DEL':
        const funcAtCursorForDel = isFunctionAtCursor(cursorPosition);
        const charBeforeCursor = newExpression[cursorPosition - 1];

        if (charBeforeCursor === ')') {
          const matchingParenDel = findMatchingParenthesis(cursorPosition - 1);
          if (matchingParenDel !== -1) {
            const funcAtLeftDel = isFunctionAtCursor(matchingParenDel);
            if (funcAtLeftDel) {
              newExpression = expression.slice(0, matchingParenDel - funcAtLeftDel.length - 1) + expression.slice(cursorPosition);
              newCursorPosition = matchingParenDel - funcAtLeftDel.length - 1;
            } else {
              newCursorPosition = cursorPosition;
            }
          }
        } else if (cursorPosition > 0) {
          if (funcAtCursorForDel) {
            const funcLength = funcAtCursorForDel.length + 1;
            newExpression = expression.slice(0, cursorPosition - funcLength) + expression.slice(cursorPosition);
            newCursorPosition = cursorPosition - funcLength;
          } else {
            newExpression = expression.slice(0, cursorPosition - 1) + expression.slice(cursorPosition);
            newCursorPosition = cursorPosition - 1;
          }
        }
        break;
      case 'MODE':
        setIsRadians(!isRadians);
        break;
      case 'SHIFT':
        setIsShiftActive(!isShiftActive);
        break;
      case 'ALPHA':
        setIsAlphaActive(!isAlphaActive);
        break;
    }

    setExpression(newExpression);
    setCursorPosition(newCursorPosition);
    setDisplay(newDisplay);
  };

  const insertAtCursor = (text) => {
    return expression.slice(0, cursorPosition) + text + expression.slice(cursorPosition);
  };

  const customEval = (expr) => {
    expr = expr.replace(/(\d+(?:\.\d+)?)\s*\^\s*(\d+(?:\.\d+)?)/g, '$1 ** $2');
    expr = expr.replace(/(\d+(?:\.\d+)?)\s*\*\*\s*(\d+(?:\.\d+)?)/g, 'Math.pow($1, $2)');
    return Function('"use strict";return (' + expr + ')')();
  };
  
  const value = {
    display,
    expression,
    setDisplay,
    setExpression,
    memory,
    setMemory,
    operator,
    setOperator,
    theme,
    handleThemeChange,
    handleInput,
    isRadians,
    isShiftActive,
    isAlphaActive,
    cursorPosition,
    setCursorPosition,
    activeFunction,
    showResult,
    setShowResult,
  };

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
};
