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
var { graphqlHTTP } = require("express-graphql");
var { buildSchema } = require("graphql");

// Init node libraries
var cors = require("cors");
const axios = require("axios").default;
const { query } = require("express");
// const bodyParser = require("body-parser");

app.use(cors());
axios.defaults.headers.common["Authorization"] = `Bearer ${API_KEY}`;
// app.use(bodyParser.json());

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Field {
    name: String!,
    value: String
  }

  type Record {
    id: Int!,
    sequence: Int!,
    createdAt: String!,
    createdBy: String!,
    modifiedAt: String,
    modifiedBy: String,
    fields: [Field]
  }

  type Query {
    hello: String
    getPerformances(page: Int, perPage: Int, order: String, desc: Boolean, new: Boolean, updated: Boolean): [Record]
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return "Hello world!";
  },

  getPerformances: async (args) => {
    try {
      let queryParams = "";

      Object.entries(args).forEach((arg) => {
        if (queryParams) queryParams += "&";
        let value = encodeURI(arg[1]);
        queryParams += `${arg[0]}=${value}`;
      });

      console.log(queryParams);

      const records = await axios.get(
        `${BASE_URL}/${TEAM_ID}/databases/${DB_ID}/tables/HF/records${queryParams ? "?" + queryParams : ""}`
      );

      const data = records.data.map((record) => {
        return {
          id: record.id,
          sequence: record.sequence,
          createdAt: record.createdAt,
          createdBy: record.createdBy,
          modifiedAt: record.modifiedAt,
          modifiedBy: record.modifiedBy,
          fields: Object.entries(record.fields).map((field) => {
            return {
              name: field[0],
              value: field[1],
            };
          }),
        };
      });

      return data;
    } catch (e) {
      console.error(e);
    }
  },
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

// Start server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
