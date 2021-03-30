var argv = require("minimist")(process.argv.slice(2));

const express = require("express");

const app = express();
const port =
  process.env.PORT || argv.Port || argv.port || argv.P || argv.p || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
