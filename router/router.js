const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
var jwt = require("jsonwebtoken");
const { signUp, Login } = require("../controller/Auth");
const router = require("express").Router();

router.post("/SignUp", upload.single("fileInput"), signUp);
router.post("/SignIn", Login);
module.exports = router;
