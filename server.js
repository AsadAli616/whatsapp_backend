const express = require("express");
const app = express();
var cors = require("cors");
var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(express.json());

app.use(cors(corsOptions));

app.use("/api/v1/whatsapp", require("./router/router"));

app.get("/", function (req, res) {
  res.send("Hello ali");
});

app.listen(3001);
