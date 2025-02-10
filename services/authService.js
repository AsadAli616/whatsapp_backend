const db = require("../models");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.ACC_PASS,
  },
});
module.exports = {
  singin: async (body) => {
    const { email, password } = body;

    const users = await db.User.findOne({
      where: { email: email },
    });
    console.log(users)
    if (!users) {
      throw new Error("Your email or password is wrong.");
    }

    const match = await bcrypt.compare(password, users.password);

    if (!match) {
      throw new Error("Your email or password in not valid");
    }
    const token = jwt.sign(
      { email: users.email, id: users.id },
      process.env.JWT_ID
    );

    return {
      name: users.firstName,
      email: users.email,
      token: token,
    };
  },

  singUp: async (body ,fileBuffer) => {
    const { email, fileName, password, firstName, lastName } = body;
    const code = Math.round(Math.random() * 1000);
    const uploadToCloudinary = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { public_id: fileName, resource_type: "auto" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(fileBuffer); // Stream the file to Cloudinary
      });
    const cloudinaryResult = await uploadToCloudinary(); // Wait for the Cloudinary upload
    if (!cloudinaryResult.secure_url) {
      throw new Error("something went worng try again.");
    }
    const data = await db.User.create({
      firstName: firstName,
      lastName: lastName,
      Pic: cloudinaryResult.secure_url,
      password: password,
      email: email,
      code: code,
    });

    if (!data) {
      throw new Error("something went worng try again.");
    }
    const info = await transporter.sendMail({
      from: process.env.USER_EMAIL,
      to: process.env.RECIVER_EMAIL, // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: `<b>code ${code} </b>`, // html body
    });
    return data;
  },
};
