require("dotenv").config();

// Ninox API configuration
const API_KEY = process.env.API_KEY;
const TEAM_ID = process.env.TEAM_ID;
const DB_ID = process.env.DB_ID;
const BASE_URL = "https://api.ninox.com/v1/teams";

// Process node arguments
var argv = require("minimist")(process.argv.slice(2));
const port =
  process.env.PORT || argv.Port || argv.port || argv.P || argv.p || 3000;

// Init express app
const express = require("express");
const app = express();

// Init node libraries
var cors = require("cors");
const axios = require("axios").default;
const bodyParser = require("body-parser");

app.use(cors());
axios.defaults.headers.common["Authorization"] = `Bearer ${API_KEY}`;
app.use(bodyParser.json());

//
// Routes:
//
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/getTables/", async (req, res) => {
  try {
    const tables = await axios.get(
      `${BASE_URL}/${TEAM_ID}/databases/${DB_ID}/tables`
    );
    res.json(tables.data);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

app.get("/api/getRecords/", async (req, res) => {
  try {
    const records = await axios.get(
      `${BASE_URL}/${TEAM_ID}/databases/${DB_ID}/tables/HF/records`
    );
    res.json(records.data);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

app.get("/api/getRecord/", async (req, res) => {
  try {
    const record = await axios.get(
      `${BASE_URL}/${TEAM_ID}/databases/${DB_ID}/tables/O/records/8`
    );
    res.json(record.data);
  } catch (e) {
    res.status(500).send(e.message);
  }
});


// Start server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
