const db = require("./models");
const app = require("./src/app");
const port = process.env.PORT || 4000;

db.sequelize.sync().then(() => {
  app.listen(port, console.log.bind(this, `listening on port ::: ${port}`));
});
