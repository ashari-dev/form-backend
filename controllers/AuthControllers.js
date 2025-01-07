import Users from "../models/Users.js";
import emailExists from "../lib/emailExist.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const env = dotenv.config().parsed;

const genAccessToken = async (payload) => {
  return jwt.sign(payload, env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: env.JWT_ACCESS_TOKEN_SECRET_TIME,
  });
};
const genRefreshToken = async (payload) => {
  return jwt.sign(payload, env.JWT_ACCESS_TOKEN_REFRESH, {
    expiresIn: env.JWT_ACCESS_TOKEN_REFRESH_TIME,
  });
};

class AuthController {
  async register(req, res) {
    try {
      if (!req.body.fullname) {
        throw { code: 400, message: "Fullname is required!!!" };
      }
      if (!req.body.email) {
        throw { code: 400, message: "Email is required!!!" };
      }
      if (!req.body.password) {
        throw { code: 400, message: "Password is required!!!" };
      }
      const emailExist = await emailExists(req.body.email);
      if (emailExist) {
        throw { code: 400, message: "Email already registered" };
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);

      const user = await Users.create({
        fullname: req.body.fullname,
        email: req.body.email,
        password: hash,
      });
      if (!user) {
        throw { code: 400, message: "User Registration Failed" };
      }

      return res.status(200).json({
        status: true,
        message: "User Registration Successful",
        data: { user },
      });
    } catch (error) {
      return res.status(error.code || 400).json({
        status: false,
        message: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      if (!req.body.email) {
        throw { code: 400, message: "Email is required!!!" };
      }
      if (!req.body.password) {
        throw { code: 400, message: "Password is required!!!" };
      }

      const user = await Users.findOne({ email: req.body.email });
      if (!user) {
        throw { code: 404, message: "Email not found" };
      }

      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isPasswordValid) {
        throw { code: 401, message: "Invalid Password" };
      }

      const payload = { id: user._id };
      const accsessToken = await genAccessToken(payload);
      const refreshToken = await genRefreshToken(payload);

      return res.status(200).json({
        status: true,
        message: "Login Successful",
        data: { fullname: user.fullname, email: user.email },
        token: { access_token: accsessToken, refresh_token: refreshToken },
      });
    } catch (error) {
      return res.status(error.code || 400).json({
        status: false,
        message: error.message,
      });
    }
  }
  async refreshToken(req, res) {
    try {
      if (!req.body.refreshToken) {
        throw { code: 400, message: "Refresh token" };
      }

      const verify = await jwt.verify(
        req.body.refreshToken,
        env.JWT_ACCESS_TOKEN_REFRESH
      );

      let payload = { id: verify.id };
      const accessToken = await genAccessToken(payload);
      const refreshToken = await genRefreshToken(payload);

      return res.status(200).json({
        status: true,
        message: "Token refreshed",
        token: { access_token: accessToken, refresh_token: refreshToken },
      });
    } catch (error) {
      console.log(error.message);
      if (error.message == "jwt expired") {
        error.message = "Refresh token expired";
      } else if (
        error.message == "invalid signature" ||
        error.message == "jwt malformed" ||
        error.message == "jwt must be provided" ||
        error.message == "invalid token" ||
        error.message == "secret or public key must be provided"
      ) {
        error.message = "Invalid refresh token";
      }
      return res.status(error.code || 400).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new AuthController();
