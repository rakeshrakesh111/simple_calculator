const display = document.querySelector(".display");

let firstNumber = null;
let operator = null;
let waitingForSecondNumber = false;

function appendNumber(number) {
    if (!display) return;

    if (waitingForSecondNumber || display.value === "0") {
        display.value = number;
        waitingForSecondNumber = false;
    } else {
        display.value += number;
    }
}

function appendDecimal() {
    if (!display) return;

    if (waitingForSecondNumber) {
        display.value = "0.";
        waitingForSecondNumber = false;
        return;
    }

    if (!display.value.includes(".")) {
        display.value += ".";
    }
}

function chooseOperator(nextOperator) {
    if (!display) return;

    const inputValue = Number(display.value);

    if (operator && !waitingForSecondNumber) {
        calculate();
    }

    firstNumber = Number(display.value);
    operator = nextOperator;
    waitingForSecondNumber = true;
}

function calculate() {
    if (!display || operator === null || firstNumber === null) {
        return;
    }

    const secondNumber = Number(display.value);
    let result;

    switch (operator) {
        case "+":
            result = firstNumber + secondNumber;
            break;

        case "-":
            result = firstNumber - secondNumber;
            break;

        case "*":
            result = firstNumber * secondNumber;
            break;

        case "/":
            if (secondNumber === 0) {
                display.value = "Cannot divide by zero";
                firstNumber = null;
                operator = null;
                waitingForSecondNumber = true;
                return;
            }
            result = firstNumber / secondNumber;
            break;

        default:
            return;
    }

    display.value = String(Number(result.toPrecision(12)));
    firstNumber = null;
    operator = null;
    waitingForSecondNumber = true;
}

function clearDisplay() {
    display.value = "0";
    firstNumber = null;
    operator = null;
    waitingForSecondNumber = false;
}

function deleteLast() {
    if (!display) return;

    if (waitingForSecondNumber) return;

    display.value = display.value.length > 1
        ? display.value.slice(0, -1)
        : "0";
}

// Connect calculator buttons to their actions
document.querySelectorAll(".calculator button").forEach(button => {
    button.addEventListener("click", () => {
        const value = button.dataset.value;
        const action = button.dataset.action;

        if (action === "clear") {
            clearDisplay();
        } else if (action === "delete") {
            deleteLast();
        } else if (action === "equals") {
            calculate();
        } else if (["+", "-", "*", "/"].includes(value)) {
            chooseOperator(value);
        } else if (value === ".") {
            appendDecimal();
        } else if (/^\d$/.test(value)) {
            appendNumber(value);
        }
    });
});