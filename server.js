require("dotenv").config({ path: require("path").join(__dirname, ".env"), override: true });
const app = require("./src/app");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5001;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch((error) => {
    console.error("MongoDB connection error:", error);
});