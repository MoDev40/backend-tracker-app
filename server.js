const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user.route");
const taskRoutes = require("./routes/task.route");



const PORT = process.env.PORT || 8000;
const app = express();


app.use(express.json());

app.use("/api/users", userRoutes)
app.use("/api/tasks",taskRoutes)

app.get('/', (req, res) => {
    res.status(200).json({message: 'Health Check'})
})

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})



