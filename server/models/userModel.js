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
    select: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
}, {
  timestamps: true
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
