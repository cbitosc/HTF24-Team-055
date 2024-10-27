require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRouter");
const taskRouter = require("./routes/taskRouter");
const cors = require('cors');

const app = express();
const corsOptions = {
    origin: 'http://localhost:5173', // allow only this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // allowed HTTP methods
    credentials: true, // allow cookies to be sent
  };
  

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log("Database connected");
}).catch((err)=> console.log(err));

app.use("/api/user",userRouter);
app.use("/api/tasks",taskRouter);

app.listen(process.env.PORT || 3000,()=>{
    console.log("App is listening on Port");
})