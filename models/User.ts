import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,

    email: {
      type: String,
      unique: true,
    },

    password: String,
     resetPasswordToken: String,

    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  }
);

const User =
  mongoose.models.User ||
  mongoose.model("User", userSchema);

export default User;


//Users be like   User ---> ( name && email && password)
          