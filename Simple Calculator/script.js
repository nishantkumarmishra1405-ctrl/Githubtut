let currentInput = '0';
let previousInput = '';
let operator = '';
let shouldResetDisplay = false;

const display = document.getElementById('display');

function updateDisplay() {
    display.value = currentInput;
}

function appendNumber(number) {
    // Prevent multiple decimals
    if (number === '.' && currentInput.includes('.')) return;
    
    if (currentInput === '0' && number !== '.') {
        currentInput = number;
    } else if (shouldResetDisplay) {
        currentInput = number;
        shouldResetDisplay = false;
    } else {
        currentInput += number;
    }
    updateDisplay();
}

function appendOperator(op) {
    if (operator !== '') {
        calculate();
    }
    previousInput = currentInput;
    operator = op;
    shouldResetDisplay = true;
}

function clearDisplay() {
    currentInput = '0';
    previousInput = '';
    operator = '';
    shouldResetDisplay = false;
    updateDisplay();
}

function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function calculate() {
    if (operator === '' || shouldResetDisplay) return;

    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                result = 'Error'; // Handle division by zero
            } else {
                result = prev / current;
            }
            break;
        default:
            return;
    }

    currentInput = String(result);
    operator = '';
    previousInput = '';
    shouldResetDisplay = true;
    updateDisplay();
}