import SequelizeMock from 'sequelize-mock';

const dbMock = new SequelizeMock();

const UserMock = dbMock.define('User', {
  firstname: 'John',
  lastname: 'Doe',
  email: 'john.doe@example.com',
  password: 'hashedpassword',
  isVerified: true,
  confirmationToken: '1234567890abcdef',
  confirmationTokenExpires: Date.now() + 3600000,
  resetPasswordToken: 'hashedtoken',
  resetPasswordExpire: Date.now() + 3600000,
  loginAttempts: 0,
  lockUntil: null
});

const Op = SequelizeMock.Op;

export { SequelizeMock as Sequelize, UserMock as User, Op };
