const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
var jwt = require("jsonwebtoken");
const { signUp, Login, verifyCode } = require("../controller/Auth");
const { addChat, findChats } = require("../controller/Chat");
const { SendMessage, findMessage } = require("../controller/Messages");
const { auth } = require("../middleware/authMiddleware");
const router = require("express").Router();
//Auth Api
router.post("/SignUp", upload.single("fileInput"), signUp);
router.post("/SignIn", Login);
router.post("/Verify", verifyCode);

//Chat Api
router.post("/addUser", auth, addChat);
router.post("/findChats", auth, findChats);
//Message Api
router.post("/SendMessage", SendMessage);
router.post("/findMessage", findMessage);

module.exports = router;
