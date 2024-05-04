import Calculator from '../src/calculator';

describe('Calculator', () => {
    let calculator;

    beforeEach(() => {
        calculator = new Calculator();
    });

    test('adds 1 + 2 to equal 3', () => {
        expect(calculator.add(1, 2)).toBe(3);
    });

    test('subtracts 3 - 2 to equal 1', () => {
        expect(calculator.sub(3, 2)).toBe(1);
    });

    test('divides 6 by 2 to equal 3', () => {
        expect(calculator.div(6, 2)).toBe(3);
    });

    test('multiplies 4 by 5 to equal 20', () => {
        expect(calculator.mult(4, 5)).toBe(20);
    });

    test('throws error when dividing by zero', () => {
        expect(() => { calculator.div(6, 0) }).toThrow();
    });
});
