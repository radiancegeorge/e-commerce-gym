const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const db = require("../../../models");

exports.createAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await db.admin.createAccount(email, password);
  res.send(admin);
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const isAdmin = await db.admin.isAdmin(email, password);
  if (!isAdmin) res.status(401).send();

  //jwt

  const token = jwt.sign({ email }, process.env.HASH, {
    expiresIn: "24h",
  });

  res.send({
    token,
  });
});
