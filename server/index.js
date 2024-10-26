require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRouter");
const taskRouter = require("./routes/taskRouter");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized: true,
    cookie: {maxAge: 24*60*60*1000}
}));
mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log("Database connected");
}).catch((err)=> console.log(err));

app.use("/api/user",userRouter);
app.use("/api/tasks",taskRouter);

app.listen(process.env.PORT || 3000,()=>{
    console.log("App is listening on Port");
})