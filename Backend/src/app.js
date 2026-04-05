const express = require('express')
const authRoutes= require('./routes/auth.routes')
const roomRoutes=require('./routes/room.routes')
const messageRoutes=require('./routes/message.routes')
const userRoutes=require('./routes/user.routes')
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const cookieParser = require('cookie-parser');

const app = express();



app.use(cors({
  origin: ["https://sic-gules.vercel.app","http://localhost:5173"], // Vite default
  credentials: true
}));






app.use(express.json());
app.use(cookieParser());


app.use('/api/auth',authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', messageRoutes);
app.use('/rooms',roomRoutes)

module.exports = app;