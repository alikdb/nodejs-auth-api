import * as dotenv from "dotenv";
dotenv.config();
import jtw from "jsonwebtoken";
import User from "../models/User.js";
const secretKey = process.env.JWT_SECRET_KEY;

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jtw.verify(token, secretKey);

    const user = await User.findOne({
      _id: decoded.id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Not authorized",
    });
  }
};

export default auth;
