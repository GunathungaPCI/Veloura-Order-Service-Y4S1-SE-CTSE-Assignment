const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: true,          // reflect request origin (dev); lock down in production
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

const orderRoutes = require('./routes/orderRoutes');
app.use('/api', orderRoutes);

app.get("/", (req, res) => {
    res.send("Order Service Running");
});

module.exports = app;
