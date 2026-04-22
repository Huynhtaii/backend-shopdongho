require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import configViewEngine from './configs/viewEngine';
import initWebRoutes from './Routes/web';
import Connection from './configs/connectDB';
import initAPIRoutes from './Routes/api';
import configCors from './configs/cors';
import cookieParser from 'cookie-parser';
import http from 'http';  // Thêm http để tạo server
const { Server } = require("socket.io");

let app = express();
let server = http.createServer(app); // Tạo server HTTP

// Cấu hình view engine 
configViewEngine(app);

// Cấu hình CORS
configCors(app);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Phục vụ tĩnh thư mục uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const io = new Server(server, {
   cors: {
      origin: process.env.REACT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
   },
   pingTimeout: 60000,
   pingInterval: 25000
});

// server.js
// server.js
io.on("connection", (socket) => {
   console.log("🟢 User connected:", socket.id);

   socket.on("joinRoom", (userId) => {
      if (userId) {
         const roomId = userId.toString();
         socket.join(roomId);
         console.log(`User ${socket.id} joined room ${roomId}`);
      }
   });

   socket.on("sendMessage", (data) => {
      try {
         console.log("📩 Message received:", data);
         
         // Đảm bảo sender_id và receiver_id là string
         const senderId = data.sender_id.toString();
         const receiverId = data.receiver_id.toString();
         
         // Broadcast tin nhắn đến tất cả client trong room
         socket.broadcast.to(receiverId).emit("receiveMessage", data);
         socket.broadcast.to(senderId).emit("receiveMessage", data);
         
         console.log(`Message broadcasted to rooms ${senderId} and ${receiverId}`);
      } catch (error) {
         console.error("Error handling message:", error);
      }
   });

   socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
   });
});
// Kết nối Database
Connection();

// Khởi tạo API và Web Routes
initAPIRoutes(app);
initWebRoutes(app);

// Lắng nghe server
let port = process.env.PORT || 6969;
server.listen(port, () => {
   console.log('🚀 Server is running at the port: ' + port);
});
