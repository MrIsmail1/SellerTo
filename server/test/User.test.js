import User from './User.js';

describe('User', () => {
  test('should be valid with correct data', () => {
    const user = new User('test@example.com', 'John', 'Doe', 'Password123', '2000-01-01');
    expect(user.isValid()).toBe(true);
  });

  test('should be invalid with incorrect email', () => {
    const user = new User('invalid-email', 'John', 'Doe', 'Password123', '2000-01-01');
    expect(user.isValid()).toBe(false);
  });

  test('should be invalid if under 13 years old', () => {
    const user = new User('test@example.com', 'John', 'Doe', 'Password123', '2012-01-01');
    expect(user.isValid()).toBe(false);
  });

  // Add more tests for password and other validations
});
