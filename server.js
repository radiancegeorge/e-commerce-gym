require("dotenv").config();
const db = require("./models");
const app = require("./src/app");
const port = process.env.PORT;

db.sequelize
  .sync()
  .then(() => {
    app.listen(port, console.log.bind(this, `listening on port ::: ${port}`));
  })
  .catch((err) => {
    console.error(err);
  });
