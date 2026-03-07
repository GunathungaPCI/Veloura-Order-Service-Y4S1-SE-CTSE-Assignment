const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const orderRoutes = require('./routes/orderRoutes');
app.use('/api', orderRoutes);

app.get("/", (req, res) => {
    res.send("Product Service Running");
});

module.exports = app;