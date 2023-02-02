const express = require("express");

const app = express();

// app.use((req, res, next) => {
//     console.log("First Middleware");
//     next();
// });
//
// app.use((req, res, next) => {
//     console.log("Second Middleware");
//     res.send("<h1>Assignment solved!</h1>");
// });

app.use("/users", (req, res, next) => {
    console.log("/users Middleware");
    res.send("<h1>/users Middleware</h1>");
});

app.use((req, res, next) => {
    console.log("/ Middleware");
    res.send("<h1>/ Middleware</h1>");
});

app.listen(3000);
