"use strict";

// Getting the display elements
const operationDisplay = document.querySelector(".operation");
const answerDisplay = document.querySelector(".answer");

// Variables to store the current operation and result
let currentOperation = "";
let result = 0;

// Function to update the display
function updateDisplay() {
  operationDisplay.textContent = currentOperation || "0"; // Show 0 if operation is empty
  answerDisplay.textContent = result;
}

// Function to handle number and operator inputs
function handleInput(value) {
  const lastChar = currentOperation[currentOperation.length - 1];

  // Prevent consecutive operators
  if (
    ["+", "-", "*", "/", "%"].includes(lastChar) &&
    ["+", "-", "*", "/", "%"].includes(value)
  ) {
    return;
  }

  currentOperation += value; // Append the current input to the operation string
  updateDisplay(); // Update the display
}

// Function to handle clearing the display (AC button)
function clearDisplay() {
  currentOperation = "";
  result = 0;
  updateDisplay();
}

// Function to calculate the result without using eval()
function calculateResult() {
  try {
    result = evaluateExpression(currentOperation); // Evaluate using the custom parser
    currentOperation = ""; // Reset the operation after the result is shown
  } catch (error) {
    result = "Error"; // Display error if something goes wrong
  }
  updateDisplay();
}

// Function to implement a safe calculator evaluation without eval()
function evaluateExpression(expression) {
  const tokens = expression.match(/(\d+\.?\d*|\+|\-|\*|\/|\%|\(|\))/g); // Tokenize the input
  if (!tokens) return 0;

  const operatorPrecedence = { "+": 1, "-": 1, "*": 2, "/": 2, "%": 2 };

  const outputQueue = [];
  const operatorStack = [];

  // Shunting-yard algorithm to handle precedence and parentheses
  tokens.forEach((token) => {
    if (isNumber(token)) {
      outputQueue.push(parseFloat(token));
    } else if ("+-*/%".includes(token)) {
      while (
        operatorStack.length > 0 &&
        operatorPrecedence[operatorStack[operatorStack.length - 1]] >=
          operatorPrecedence[token]
      ) {
        outputQueue.push(operatorStack.pop());
      }
      operatorStack.push(token);
    } else if (token === "(") {
      operatorStack.push(token);
    } else if (token === ")") {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1] !== "("
      ) {
        outputQueue.push(operatorStack.pop());
      }
      operatorStack.pop(); // Remove the '(' from stack
    }
  });

  while (operatorStack.length > 0) {
    outputQueue.push(operatorStack.pop());
  }

  return evaluateRPN(outputQueue); // Evaluate the Reverse Polish Notation (RPN)
}

// Function to evaluate Reverse Polish Notation (RPN)
function evaluateRPN(rpn) {
  const stack = [];

  rpn.forEach((token) => {
    if (isNumber(token)) {
      stack.push(token);
    } else {
      const b = stack.pop();
      const a = stack.pop();
      switch (token) {
        case "+":
          stack.push(a + b);
          break;
        case "-":
          stack.push(a - b);
          break;
        case "*":
          stack.push(a * b);
          break;
        case "/":
          stack.push(a / b);
          break;
        case "%":
          stack.push(a % b);
          break;
      }
    }
  });

  return stack[0]; // The final result is at the top of the stack
}

// Helper function to check if a token is a number
function isNumber(token) {
  return !isNaN(token);
}

// Adding event listeners to the buttons
document.querySelectorAll(".key").forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.textContent;

    if (value === "AC") {
      clearDisplay(); // Clear the operation if "AC" is pressed
    } else if (value === "=") {
      calculateResult(); // Calculate the result if "=" is pressed
    } else {
      handleInput(value); // Otherwise, handle input (numbers and operators)
    }
  });
});
