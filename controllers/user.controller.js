const { default: axios } = require("axios");
const connection = require("../db");
const CreateOtpAndToken = require("../utils/otp");
const Sendmail = require("../utils/sendmail");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
require("dotenv").config();
const path = require('path');



const userController = {


  signup: async (req, res) => {
    const { email, name, password } = req.body;

    if (req.body.role) {
      return res
        .status(400)
        .json({ message: "you can  not have permission for this" });
    }

    if (!email || !name || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const { otp, token } = CreateOtpAndToken({ ...req.body });

    try {
      const htmltemplate = await ejs.renderFile(
        __dirname + "/../views/email.ejs",
        {
          name,
          otp,
        }
      );

      console.log(1);
      let result = await Sendmail(email, htmltemplate);
      console.log(result);

      res
        .cookie("verification_token", token)
        .status(200)
        .json({ message: "Otp send ..." });
    } catch (error) {
      res.status(400).json({ message: error?.message });
    }
  },
  verify: async (req, res) => {
    if (!req.cookies.verification_token) {
      return res.status(400).json({ message: "please sign up first" });
    }

    try {
    const decoded = jwt.verify(
        req.cookies.verification_token,
        process.env.JWT_SECRET
      );

console.log(decoded)
      if (!decoded) {
        return res.status(400).json({ message: "token is invalid" });
      }
      const { otp, userData } = decoded;

      if (otp !== req.body.otp) {
        return res.status(400).json({ message: "otp is  not valid" });
      }
      //hashpassword
      try {
        const hashpassword = await bcrypt.hash(userData.password , 10);

        // Save the user in the database
        const user = await UserModel.create({
        ...userData,
          password: hashpassword,
        });

        // Render confirmation message using EJS template
        const htmltemplate = await ejs.renderFile(
          path.join(__dirname, "../views/confirmation.ejs"),
          {
            name: userData.name,
          }
        ); // Send the confirmation email
        await Sendmail(userData.email, htmltemplate, "confirmation message");

        res
          .status(201)
          .json({ message: "User registered and email sent.", user });
      } catch (error) {
        return res.status(400).json({ message: error?.message });
      }
    } catch (error) {
      return res.status(400).json({ message: error?.message });
    }
  },
  signin: async (req, res) => {},
};

module.exports = userController;
