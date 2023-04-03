const expressAsyncHandler = require("express-async-handler");
const checkValidation = require("../../middlewares/checkValidation");
const bcrypt = require("bcrypt");
const db = require("../../../models");
const rs = require("randomstring");
const jwt = require("jsonwebtoken");
const getTemplate = require("../../utils/templateReader");
const sendMail = require("../../utils/mailer");

exports.createUser = expressAsyncHandler(async (req, res) => {
  await checkValidation(req);
  const t = await db.sequelize.transaction();
  try {
    const { rePassword, email, firstName, lastName, phoneNumber } = req.body;
    const password = await bcrypt.hash(
      rePassword,
      Number(process.env.SALT) ?? 10
    );
    const newUser = await db.users.create(
      {
        password,
        firstName,
        lastName,
        email,
        phoneNumber,
      },
      {
        transaction: t,
      }
    );
    const code = rs.generate(32);

    await db.emailVerifications.create(
      {
        code,
        userId: newUser.id,
      },
      {
        transaction: t,
      }
    );

    //email the verification code to the user!
    const link = `${process.env.SERVER_URL}/verification/${code}`;
    const template = getTemplate("welcome.html", {
      name: lastName,
      link,
    });

    //sending email
    await sendMail({
      html: template,
      subject: "Welcome",
      name: "Active",
      to: newUser.email,
      text: link,
    });
    res.status(201).send(newUser);
    await t.commit();
  } catch (err) {
    await t.rollback();
    throw err;
  }
});

exports.reSendVerification = expressAsyncHandler(async (req, res) => {
  await checkValidation(req);
  const t = await db.sequelize.transaction();
  const { email } = req.params;
  try {
    const user = await db.users.findOne({
      where: { email },
    });
    if (!user) {
      res.status(400).send({ msg: "User not found!" });
      return;
    }
    if (user.verified) {
      res.status(400).send({ msg: "Email already verified" });
      return;
    }
    const code = rs.generate(32);

    await db.emailVerifications.upsert(
      { code, userId: user.id },
      { transaction: t }
    );

    //send mail
    const link = `${process.env.SERVER_URL}/verification/${code}`;
    const template = getTemplate("welcome.html", {
      name: user.lastName,
      link,
    });

    //sending email
    await sendMail({
      html: template,
      subject: "Resend Verification",
      name: "Active",
      to: user.email,
      text: link,
    });
    res.send();
    await t.commit();
  } catch (err) {
    await t.rollback();
    throw err;
  }
});

exports.verifyUser = expressAsyncHandler(async (req, res) => {
  const { code } = req.params;
  const t = await db.sequelize.transaction();
  try {
    const ver = await db.emailVerifications.findOne({
      where: {
        code,
      },
    });
    if (!ver) res.status(400).send({ msg: "invalid code!" });
    await db.users.update(
      { verified: true },
      {
        where: {
          id: ver.userId,
        },
      }
    );
    res.redirect(process.env.CLIENT_URL + "/login/success");
    await t.commit();
  } catch (err) {
    await t.rollback();
    throw err;
  }
});

exports.loginUser = expressAsyncHandler(async (req, res) => {
  await checkValidation(req);
  const { email, password } = req.body;
  const user = await db.users.findOne({
    where: {
      email,
    },
  });
  if (!user) res.status(400).send({ msg: "User not found!" });

  const isUser = await bcrypt.compare(password, user.password);

  if (!isUser) res.status(401).send({ msg: "Incorrect Password!" });

  if (!user.verified)
    res.status(400).send({ msg: "Please Verify email address" });

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    process.env.HASH,
    {
      expiresIn: "30 days",
    }
  );

  //read email template

  res.send({ token });
});
