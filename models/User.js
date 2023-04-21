import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import md5 from "../utils/md5.js";
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  tokens: [
    {
      token: { type: String, required: true },
    },
  ],
});
UserSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY);
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = md5(this.password);
  }
  next();
});
const User = mongoose.model("User", UserSchema);

export default User;
