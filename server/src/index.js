const express = require("express");
const connectDB = require("./db/connect");
const authRoutes = require("./routes/auth.route");
const cookieParser = require("cookie-parser");
const messageRoutes = require("./routes/message.route");
const cors = require("cors");
const notFound = require("./middlewares/not-found");
require("dotenv").config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Chat App!");
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.use(notFound);

// Connect to MongoDB
const start = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

start();
// Error handling middleware
