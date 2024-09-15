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
    let newDisplay = display;

    const insertFunction = (func) => {
      newExpression = insertAtCursor(`${func}()`);
      newCursorPosition = cursorPosition + func.length + 1;
      setActiveFunction(func);
    };

    const isFunctionAtCursor = (pos) => {
      const funcMatch = newExpression.slice(0, pos).match(/(sin|cos|tan|cot|log10|ln|exp|sqrt)\($/);
      return funcMatch ? funcMatch[0] : null;
    };

    const findFunctionAtCursor = (pos) => {
      const beforeCursor = newExpression.slice(0, pos);
      const afterCursor = newExpression.slice(pos);
      const funcBeforeMatch = beforeCursor.match(/(sin|cos|tan|cot|log10|ln|exp|sqrt)\($/) ||
                              beforeCursor.match(/(sin|cos|tan|cot|log10|ln|exp|sqrt)\([^(]*$/);
      const funcAfterMatch = afterCursor.match(/^\)/) ||
                             afterCursor.match(/^[^)]*\)/);
      
      if (funcBeforeMatch) {
        const funcStart = beforeCursor.lastIndexOf(funcBeforeMatch[0]);
        const funcEnd = pos + (funcAfterMatch ? funcAfterMatch[0].length : 0);
        return [funcStart, funcEnd, funcBeforeMatch[1]];
      }
      return null;
    };

    // const isFunctionBeforeCursor = (pos) => {
    //   const funcMatch = newExpression.slice(0, pos).match(/(sin|cos|tan|cot|log10|ln|exp|sqrt)\($/);
    //   return funcMatch ? funcMatch[1] : null;
    // };

    const findMatchingParenthesis = (pos) => {
      let depth = 0;
      for (let i = pos; i < newExpression.length; i++) {
        if (newExpression[i] === '(') depth++;
        if (newExpression[i] === ')') depth--;
        if (depth === 0) return i;
      }
      return -1;
    };

    // const findFunctionRange = (pos) => {
    //   const beforeCursor = newExpression.slice(0, pos);
    //   const funcMatch = beforeCursor.match(/(sin|cos|tan|cot|log10|ln|exp|sqrt)\([^)]*$/);
    //   if (funcMatch) {
    //     const funcStart = beforeCursor.lastIndexOf(funcMatch[0]);
    //     const funcEnd = findMatchingParenthesis(funcStart + funcMatch[1].length);
    //     return funcEnd !== -1 ? [funcStart, funcEnd + 1] : null;
    //   }
    //   return null;
    // };

    const calculateFunction = (func, arg) => {
      switch(func.toLowerCase()) {
        case 'sin': return Math.sin(isRadians ? arg : arg * Math.PI / 180);
        case 'cos': return Math.cos(isRadians ? arg : arg * Math.PI / 180);
        case 'tan':
          if ((arg % 180 === 90 && !isRadians) || (arg % Math.PI === Math.PI / 2 && isRadians)) {
            throw new Error('Syntax Error');
          }
          return Math.tan(isRadians ? arg : arg * Math.PI / 180);
        case 'cot':
          if (arg % 180 === 0 && !isRadians || arg % Math.PI === 0 && isRadians) {
            throw new Error('Syntax Error');
          }
          return 1 / Math.tan(isRadians ? arg : arg * Math.PI / 180);
        case 'log10':
          if (arg <= 0) throw new Error('Syntax Error');
          return Math.log10(arg);
        case 'ln':
          if (arg <= 0) throw new Error('Syntax Error');
          return Math.log(arg);
        case 'exp': return Math.exp(arg);
        case 'sqrt':
          if (arg < 0) throw new Error('Syntax Error');
          return Math.sqrt(arg);
        default: throw new Error(`Unknown function: ${func}`);
      }
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
        if (newCursorPosition > 0) {
          const funcAtLeft = isFunctionAtCursor(newCursorPosition);
          if (funcAtLeft) {
            newCursorPosition -= funcAtLeft.length;
          } else if (newExpression[newCursorPosition - 1] === ')') {
            const matchingParenLeft = findMatchingParenthesis(newCursorPosition - 1);
            if (matchingParenLeft !== -1) {
              newCursorPosition = matchingParenLeft;
            } else {
              newCursorPosition--;
            }
          } else {
            newCursorPosition--;
          }
        }
        break;
      case 'RIGHT':
        if (newCursorPosition < newExpression.length) {
          const funcMatch = newExpression.slice(newCursorPosition).match(/^(sin|cos|tan|cot|log10|ln|exp|sqrt)\(/);
          if (funcMatch) {
            newCursorPosition += funcMatch[0].length;
          } else if (newExpression[newCursorPosition] === '(') {
            const matchingParenRight = findMatchingParenthesis(newCursorPosition);
            if (matchingParenRight !== -1) {
              newCursorPosition = matchingParenRight + 1;
            } else {
              newCursorPosition++;
            }
          } else {
            newCursorPosition++;
          }
        }
        break;
      case 'UP':
      case 'DOWN':
        break;
      case '=':
        try {
          const evalExpression = newExpression.replace(/(\w+)\((.*?)\)/g, (match, func, args) => {
            const argValue = customEval(args);
            return calculateFunction(func, argValue);
          });
  
          let result = customEval(evalExpression);
          result = parseFloat(result.toFixed(10));
  
          if (result === Infinity || isNaN(result)) {
            throw new Error('Syntax Error');
          }
  
          newDisplay = String(result);
          setAnswer(result);
          setShowResult(true);
          setActiveFunction(null);
        } catch (error) {
          newDisplay = 'Syntax Error';
          setShowResult(true);
          setActiveFunction(null);
          setDisplay(newDisplay);
        }
        break;
      case 'AC':
        newExpression = '';
        newCursorPosition = 0;
        setDisplay('0');
        setShowResult(false);
        setActiveFunction(null);
        break;
        case 'DEL':
          if (newCursorPosition > 0) {
            const functionInfo = findFunctionAtCursor(newCursorPosition);
            if (functionInfo) {
              const [funcStart, funcEnd, funcName] = functionInfo;
              if (newCursorPosition === funcStart + funcName.length + 1 ||
                  newCursorPosition === funcEnd ||
                  (newCursorPosition === funcStart + funcName.length + 1 && 
                   newExpression[newCursorPosition] !== ')')) {
                newExpression = newExpression.slice(0, funcStart) + newExpression.slice(funcEnd);
                newCursorPosition = funcStart;
              } else {
                newExpression = newExpression.slice(0, newCursorPosition - 1) + newExpression.slice(newCursorPosition);
                newCursorPosition--;
              }
            } else {
              newExpression = newExpression.slice(0, newCursorPosition - 1) + newExpression.slice(newCursorPosition);
              newCursorPosition--;
            }
          }
          break;

      case 'RAD/DEG':
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
    expr = expr.replace(/(\w+)\((.*?)\)/g, (match, func, args) => {
      const argValue = customEval(args);
      return calculateFunction(func, argValue);
    });
  
    expr = expr.replace(/(\d+(?:\.\d+)?|\))\s*\^\s*(\d+(?:\.\d+)?)/g, (match, base, exp) => {
      return `Math.pow(${base}, ${exp})`;
    });
  
    if (/\/\s*0(?!\.)/.test(expr)) {
      throw new Error('Syntax Error');
    }
  
    return new Function(`return ${expr}`)();
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