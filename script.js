document.addEventListener("DOMContentLoaded", function() {

    class View {
        constructor() {
            this.input = document.getElementById('input');
            this.number = document.querySelectorAll('.number');
            this.operator = document.querySelectorAll('.operator');
            this.backSpace = document.getElementById('backSpace');
            this.result = document.getElementById('result');
            this.clear = document.getElementById('clear');
        }
        addDataToInput = (data) => {
            this.input.innerHTML += data;
        }
        updateInput = (result) => {
            this.input.innerHTML = result;
        }
    }

    class Model {
        constructor(view) {
            this.view = view;
            this.aim;
            this.resultDisplayed = false;
        }
        keyEventHandler = (event) => {
            switch (event.key) {
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                case "0":
                case ".":
                    this.numbersHandler(event);
                    break;
                case "+":
                case "-":
                case "*":
                case "/":
                    this.operatorsHandler(event);
                    break;
                case "Backspace":
                    this.backSpaceHandler();
                    break;
                case "Enter":
                    this.resultHandler();
                    break;
                case "c":
                    this.clearHandler();
                    break;
            }
        }
        numbersHandler = (e) => {
            if (e instanceof KeyboardEvent) {
                this.aim = e.key;
            } else if (e instanceof PointerEvent) {
                this.aim = e.target.innerHTML;
            }

            var currentString = this.view.input.innerHTML;
            var lastChar = currentString[currentString.length - 1];

            if (this.resultDisplayed === false) {
                this.view.addDataToInput(this.aim);
            } else if (this.resultDisplayed === true && lastChar === "+" || lastChar === "-" || lastChar === "×" || lastChar === "÷") {
                this.resultDisplayed = false;
                this.view.addDataToInput(this.aim);
            } else {
                this.resultDisplayed = false;
                this.clearHandler();
                this.view.addDataToInput(this.aim);
            }
        }
        operatorsHandler = (e) => {
            if (e instanceof KeyboardEvent) {
                if (e.key === '*') {
                    this.aim = "×";
                } else if (e.key === '/') {
                    this.aim = "÷";
                } else {
                    this.aim = e.key;
                }
            } else if (e instanceof PointerEvent) {
                this.aim = e.target.innerHTML;
            }

            var currentString = this.view.input.innerHTML;
            var lastChar = currentString[currentString.length - 1];

            if (currentString === "wrong expr.") {
                this.clearHandler();
                this.view.addDataToInput(this.aim);
            } else {
                if (lastChar === "+" || lastChar === "-" || lastChar === "×" || lastChar === "÷") {
                    var newString = currentString.substring(0, currentString.length - 1) + this.aim;
                    this.view.updateInput(newString);
                } else if (this.aim === "-") {
                    this.view.addDataToInput(this.aim);
                } else if (currentString.length == 0) {
                    console.log("expression can't start from +, × or ÷");
                } else {
                    this.view.addDataToInput(this.aim);
                }
            }
        }
        backSpaceHandler = () => {
            var currentString = this.view.input.innerHTML;
            var newString = currentString.substring(0, currentString.length - 1);
            this.view.updateInput(newString);
        }
        resultHandler = () => {
            var inputString = this.view.input.innerHTML;
            var lastChar = inputString[inputString.length - 1];
            var numbers = inputString.split(/\+|\-|\×|\÷/g);
            var operators = inputString.replace(/[0-9]|\./g, "").split("");

            var divide = operators.indexOf("÷");
            while (divide != -1) {
                numbers.splice(divide, 2, numbers[divide] / numbers[divide + 1]);
                operators.splice(divide, 1);
                divide = operators.indexOf("÷");
            }

            var multiply = operators.indexOf("×");
            while (multiply != -1) {
                numbers.splice(multiply, 2, numbers[multiply] * numbers[multiply + 1]);
                operators.splice(multiply, 1);
                multiply = operators.indexOf("×");
            }

            var subtract = operators.indexOf("-");
            while (subtract != -1) {
                numbers.splice(subtract, 2, numbers[subtract] - numbers[subtract + 1]);
                operators.splice(subtract, 1);
                subtract = operators.indexOf("-");
            }

            var add = operators.indexOf("+");
            while (add != -1) {
                numbers.splice(add, 2, parseFloat(numbers[add]) + parseFloat(numbers[add + 1]));
                operators.splice(add, 1);
                add = operators.indexOf("+");
            }
            var resultStr = numbers[0].toString();

            if (lastChar === "+" || lastChar === "-" || lastChar === "×" || lastChar === "÷") {
                console.log("Please enter a number at the end")
            } else if (isNaN(numbers[0])) {
                this.view.updateInput("wrong expr.");
                this.resultDisplayed = true;
            } else {
                if (resultStr.split('').includes('.') && resultStr.split('.')[1].length >= 7) {
                    this.view.updateInput(Math.round(numbers[0] * 10000000) / 10000000);
                } else {
                    this.view.updateInput(numbers[0]);
                }
                this.resultDisplayed = true;
            }
        }
        clearHandler = () => {
            this.view.updateInput("");
        }
    }

    class Controller {
        constructor(view, model) {
            this.view = view;
            this.model = model;
        }
        handle() {
            document.addEventListener('keydown', this.model.keyEventHandler);
            this.view.number.forEach(el => el.addEventListener("click", this.model.numbersHandler));
            this.view.operator.forEach(el => el.addEventListener("click", this.model.operatorsHandler));
            this.view.backSpace.addEventListener("click", this.model.backSpaceHandler);
            this.view.result.addEventListener("click", this.model.resultHandler);
            this.view.clear.addEventListener("click", this.model.clearHandler);
        }
    }

    (function init() {
        const view = new View();
        const model = new Model(view);
        const controller = new Controller(view, model);
        controller.handle();
    })();

});