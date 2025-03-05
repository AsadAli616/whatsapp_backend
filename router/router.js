const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
var jwt = require("jsonwebtoken");
const {
  signUp,
  Login,
  verifyCode,
  editeProfile,
} = require("../controller/Auth");
const { addChat, findChats } = require("../controller/Chat");
const {
  SendMessage,
  findMessage,
  allowNotification,
} = require("../controller/Messages");
const { auth } = require("../middleware/authMiddleware");
const router = require("express").Router();
//Auth Api
router.post("/SignUp", upload.single("fileInput"), signUp);
router.post("/SignIn", Login);
router.post("/Verify", verifyCode);
router.post("/editeProfile", upload.single("fileInput"), editeProfile);

//Chat Api
router.post("/addUser", auth, addChat);
router.post("/findChats", auth, findChats);
//Message Api
router.post("/SendMessage", auth, SendMessage);
router.post("/findMessage", auth, findMessage);
router.post("/allowNotification", auth, allowNotification);
module.exports = router;
