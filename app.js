const express = require("express");
const cors = require("cors");
const multer = require("multer");
const morgan = require("morgan");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
cors: { origin: "*" },
methods: ["GET", "POST", "PUT", "DELETE"],
});


io.on('connection', (socket) => {
  
  socket.on('joinConversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`A user joined conversation: ${conversationId}`);
  });

  socket.on('sendMessage', (message) => {
    console.log("😂😂",message);
      socket.to(message.conversationId).emit('newMessage',message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


const patientRouter = require("./routes/patients");

const doctorRouter = require("./routes/doctors");

const requestRouter = require("./routes/requests");

const messageRouter = require("./routes/messages");

const conversationRouter = require("./routes/conversations");

const adminRouter = require("./routes/admin");

const appointmentRouter = require("./routes/appoitments");

const upload = multer();

app.use(upload.any());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());

app.use("/api/patients", patientRouter);
app.use("/api/doctors", doctorRouter);
app.use("/api/requests", requestRouter);
app.use("/api/messages", messageRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api/admin", adminRouter);
app.use("/api/appointment", appointmentRouter);



httpServer.listen(3000, () => {
  console.log('app listening on port 3000');
  });