// npm i @treblle/express --save
const treblle = require("@treblle/express");
const app = express();

app.use(treblle());

app.use(
  treblle({
    apiKey: process.env.TREBLLE_API_KEY,
    projectId: process.env.TREBLLE_PROJECT_ID,
    additionalFieldsToMask: [],
  })
);









