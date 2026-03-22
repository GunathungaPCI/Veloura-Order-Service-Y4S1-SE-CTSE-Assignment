const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const YAML = require("js-yaml");
const swaggerUi = require("swagger-ui-express");

const app = express();

app.use(cors({
  origin: true,          // reflect request origin (dev); lock down in production
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

const orderRoutes = require('./routes/orderRoutes');
app.use('/api', orderRoutes);

const openapiPath = path.join(__dirname, "..", "openapi.yaml");
const swaggerDocument = YAML.load(fs.readFileSync(openapiPath, "utf8"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
    res.send("Order Service Running");
});

module.exports = app;
