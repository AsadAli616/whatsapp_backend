const db = require("../models");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const saltRounds = 10;

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
    console.log(users);
    if (!users) {
      throw new Error("Your email or password is wrong.");
    }

    const match = await bcrypt.compare(password, users.password);

    if (!match) {
      throw new Error("Your email or password in not valid");
    }
    if (!users.verify) {
      throw new Error("Your email email is not verified");
    }
    const token = jwt.sign(
      { email: users.email, id: users.id },
      process.env.JWT_ID
    );

    return {
      id: users.id,
      name: users.firstName,
      email: users.email,
      token: token,
      Pic: users.Pic,
      whatappstatus: users.whatappstatus,
    };
  },

  singUp: async (body, fileBuffer) => {
    const { email, fileName, password, firstName, lastName } = body;
    const user = await db.User.findOne({
      where: { email: email },
    });
    if (user) {
      throw new Error("This account already exist.");
    }
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
    const cloudinaryResult = await uploadToCloudinary();
    if (!cloudinaryResult.secure_url) {
      throw new Error("something went worng try again.");
    }
    const pasword = await bcrypt.hash(password, saltRounds);

    const data = await db.User.create({
      firstName: firstName,
      lastName: lastName,
      Pic: cloudinaryResult.secure_url,
      password: pasword,
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
  Code: async (body) => {
    const { email, code } = body;
    const data = await db.User.findOne({ where: { email: email } });
    if (!data) {
      throw new Error("User does not exist");
    }
    if (code != data.code) {
      throw new Error("ples enter correct code ");
    }
    const verfying = await db.User.update(
      {
        verify: true,
      },
      { where: { email: email } }
    );
    const token = jwt.sign(
      { email: data.email, id: data.id },
      process.env.JWT_ID
    );
    console.log(verfying);
    if (verfying[0] == 0) {
      throw new Error("somthing went wrong");
    }
    return {
      data: "your account is verified",
      user: {
        id: data.firstName,
        name: data.firstName,
        email: data.email,
        token: token,
        Pic: data.Pic,
        whatappstatus: data.whatappstatus,
      },
    };
  },
  editeProfile: async (body, fileBuffer) => {
    console.log(fileBuffer);
    const { id, name, whatappstatus, fileName } = body;
    if (!fileBuffer && !fileName) {
      throw new Error("image is note provided");
    }

    const uploadToCloudinary = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { public_id: fileName, resource_type: "auto" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(fileBuffer);
      });
    const cloudinaryResult = await uploadToCloudinary();
    if (!cloudinaryResult.secure_url) {
      throw new Error("something went worng try again.");
    }
    const data = await db.User.update(
      {
        firstName: name,
        whatappstatus: whatappstatus,
        Pic: cloudinaryResult.secure_url,
      },
      {
        where: {
          id: id,
        },
      }
    );
    if (data[0] !== 1) {
      throw new Error("something went wrong");
    }
    const user = await db.User.findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new Error("something went wrong");
    }
    console.log("user", user);

    return {
      name: user.firstName,
      Pic: user.Pic,
      whatappstatus: user.whatappstatus,
    };
  },
  editDetail: async (body) => {
    const { id, name, whatappstatus } = body;

    const data = await db.User.update(
      {
        firstName: name,
        whatappstatus: whatappstatus,
      },
      {
        where: {
          id: id,
        },
      }
    );

    if (data[0] !== 1) {
      throw new Error("something went wrong");
    }

    const user = await db.User.findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new Error("something went wrong");
    }
    console.log("user", user);

    return {
      name: user.firstName,
      Pic: user.Pic,
      whatappstatus: user.whatappstatus,
    };
  },
};
