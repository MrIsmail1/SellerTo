import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Veuillez ajouter un prénom"],
    maxlength: 50
  },
  lastname: {
    type: String,
    required: [true, "Veuillez ajouter un nom de famille"],
    maxlength: 50
  },
  email: {
    type: String,
    required: [true, "Veuillez ajouter un email"],
    unique: true,
    match: [/\S+@\S+\.\S+/, "Veuillez utiliser une adresse email valide"]
  },
  password: {
    type: String,
    required: [true, "Veuillez ajouter un mot de passe"],
    minlength: 12,
    select: false,
    validate: {
      validator: function(v) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\^\$*.\[\]{}\(\)?\-\"!@#%&/\\,><':;|_~`])\S{12,}$/.test(v);
      },
      message: props => `Votre mot de passe doit contenir au moins 12 caractères, une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.`
    },
    select: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  passwordChangedAt: Date,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  confirmationToken: {
    type: String,
    required: false
  },
  confirmationTokenExpires: {
    type: Date,
    required: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  loginAttempts: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  lockUntil: {
    type: Number 
  }
  }, {
    timestamps: true
  });

userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Hook pour hacher le mot de passe avant de le sauvegarder
userSchema.pre('save', async function(next) {

  // Pour les 6 mois
  if (this.isModified('password') && !this.isNew) {
    this.passwordChangedAt = Date.now() - 1000;
  }

  // Hacher le mot de passe si celui-ci a été modifié
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
