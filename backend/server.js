require("dns").setServers(["8.8.8.8", "8.8.4.4"]);
require("dns").setDefaultResultOrder("ipv4first");
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Connected");

        app.listen(process.env.PORT || 3000, () => {
            console.log("Server running at http://localhost:3000");
        });
    })
    .catch(err => {
        console.log(err);
    });

app.get("/", (req, res) => {
    res.json({
        message: "Task Manager Auth API is running"
    });
});