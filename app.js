const express = require("express");
const cors = require("cors");
const multer = require("multer");
var morgan = require("morgan");
const { createServer } = require("http");
const { Server } = require("socket.io");

const patientRouter = require("./routes/patients");
const doctorRouter = require("./routes/doctors");
const requestRouter = require("./routes/requests");
const messageRouter = require ("./routes/messages");
const conversationRouter = require ("./routes/conversations");
const adminRouter  = require("./routes/admin")
const appointmentRouter  = require("./routes/appoitments")
const paymentRouter = require("./routes/payment")

const app = express();
const upload = multer();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:8081",
  }, 
});


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
app.use("/api/admin",adminRouter)
app.use("/api/appointment",appointmentRouter)
app.use("/api/payments",paymentRouter)

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  
});


io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinConversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`A user joined conversation: ${conversationId}`);
  });

  socket.on('sendMessage', (message) => {
   
      socket.to(message.conversationId.toString()).emit('newMessage', message);
    
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const port = process.env.PORT || 3000;
server.listen(3000, () => {
  console.log(`app listening on port ${port}`);
});
