require("dotenv").config();

const { createApp } = require("./app");

const port = Number(process.env.PORT || 4000);
const app = createApp();

app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`);
});
