// reference: https://dev.to/lenmorld/quick-server-with-node-and-express-in-5-minutes-17m7
const express = require('express');
const app = express();
const port = 4000;

app.use(express.static('public'));
app.get("/", (_, res) => {
   res.sendFile(__dirname + '/index.html');
});

app.get("/json", (_, res) => {
   res.json({ message: "Hello world" });
});

app.listen(port, () => {
    console.log(`Server listening at ${port}`);
});