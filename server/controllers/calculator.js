export class Calculator {
    add(a, b) {
        return a + b;
    }

    sub(a, b) {
        return a - b;
    }

    div(a, b) {
        if (b === 0) {
            throw new Error("Division by zero");
        }
        return a / b;
    }

    mult(a, b) {
        return a * b;
    }
}