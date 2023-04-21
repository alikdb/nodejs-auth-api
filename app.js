import express from "express";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import User from "./models/User.js";
import mongoose from "mongoose";
import md5 from "./utils/md5.js";
import auth from "./middleware/auth.js  ";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const secretKey = process.env.JTW_SECRET;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use(bodyParser.json());

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const emailStatus = await User.findOne({ email });

  if (emailStatus) {
    res.status(400).json({
      message: "Zaten bu mail adresinde bir kullanıcı kayıtlı",
      status: false,
    });
    return false;
  }

  try {
    const user = User({
      name,
      email,
      password: password,
    });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Server Error",
    });
  }
});

app.get("/authenticate", auth, async (req, res) => {
  res.json({ user: req.user });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "Authentication failed!" });
      return false;
    } else {
      const md5Pass = md5(password);
      console.log(user.password);
      if (user.password != md5Pass) {
        res.status(401).json({ message: "Authentication failed!" });
        return false;
      }
    }

    const token = await user.generateAuthToken();
    res.status(200).json({
      user,
      token,
    });
    return true;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
