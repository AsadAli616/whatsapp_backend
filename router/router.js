const multer = require("multer");
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
});

const {
  signUp,
  Login,
  verifyCode,
  editeProfile,
  editeDetails,
} = require("../controller/Auth");
const {
  addChat,
  findChats,
  blockedChat,
  unblockChats,
} = require("../controller/Chat");
const {
  SendMessage,
  findMessage,
  allowNotification,
  sendVideos,
  sendVideoMessage,
} = require("../controller/Messages");
const { auth } = require("../middleware/authMiddleware");
const router = require("express").Router();
//Auth Api
router.post("/SignUp", upload.single("fileInput"), signUp);
router.post("/SignIn", Login);
router.post("/Verify", verifyCode);
router.post("/editeProfile", upload.single("fileInput"), editeProfile);
router.post("/editeDetails", upload.single("fileInput"), editeDetails);

//Chat Api
router.post("/addUser", auth, addChat);
router.post("/findChats", auth, findChats);
router.post("/blockedChat", auth, blockedChat);
router.post("/unblockedChat", auth, unblockChats);

//Message Api
router.post("/SendMessage", auth, SendMessage);
router.post("/findMessage", auth, findMessage);
router.post("/sendVideos", upload.single("fileInput"), sendVideos);
router.post("/sendVideoMessage", upload.single("fileInput"), sendVideoMessage);
router.post("/allowNotification", auth, allowNotification);

module.exports = router;
