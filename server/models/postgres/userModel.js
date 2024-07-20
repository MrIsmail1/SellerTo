import bcrypt from "bcryptjs";
import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Users = sequelize.define(
  "Users",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 50],
      },
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 50],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [12],
      },
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpire: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    passwordChangedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "User",
      validate: {
        isIn: [["SuperAdmin", "Admin", "User"]],
      },
    },
    confirmationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    confirmationTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    loginAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    lockUntil: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeSave: async (users, options) => {
        if (users.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          users.password = await bcrypt.hash(users.password, salt);
        }
      },
    },
  }
);

Users.prototype.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

Users.prototype.anonymize = async function () {
  this.firstname = "Anonyme";
  this.lastname = "Utilisateur";
  this.email = `anonymous_${this.id}@example.com`;
  this.password = `${this.id}fdtPZtsWCiLc6Tme#87ujH#!@=YyZ915R@Y+I*QowC+gGcUI3=qEoOJvu4M@c&gj9xyv#iCgQI!9J0!4E&YP*H$PY#yyoPc+jkgx`;
  this.resetPasswordToken = null;
  this.resetPasswordExpire = null;
  this.passwordChangedAt = null;
  this.confirmationToken = null;
  this.confirmationTokenExpires = null;
  this.isVerified = false;
  this.loginAttempts = 0;
  this.lockUntil = null;
  this.address = null;
  this.country = null;
  this.phoneNumber = null;
  this.postalCode = null;
  this.city = null;
  await this.save();
};

export default Users;
