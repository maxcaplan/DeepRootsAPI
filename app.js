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

// Init Graphql
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

// Init node libraries
var cors = require("cors");
const axios = require("axios").default;
const bodyParser = require("body-parser");

app.use(cors());
axios.defaults.headers.common["Authorization"] = `Bearer ${API_KEY}`;
app.use(bodyParser.json());

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
  }
`);
 
// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  },
};

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

// Start server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
