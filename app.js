const express = require("express");
const cors = require("cors");
const multer = require("multer");
const morgan = require("morgan");
const { createServer } = require("http");
const { Server } = require("socket.io");
const prisma = require("./db/prisma");

const patientRouter = require("./routes/patients");
const doctorRouter = require("./routes/doctors");
const requestRouter = require("./routes/requests");
const conversationRouter = require("./routes/conversations");
const adminRouter = require("./routes/admin");
const appointmentRouter = require("./routes/appoitments");
const paymentRouter = require("./routes/payment");
const { message } = require("./db/prisma");

const app = express();
const upload = multer();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:8081", "http://localhost:5173"],
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
app.use("/api/conversations", conversationRouter);
app.use("/api/admin", adminRouter);
app.use("/api/appointment", appointmentRouter);
app.use("/api/payments", paymentRouter);

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`A user joined conversation: ${conversationId}`);
  });

  socket.on("sendMessage", (message) => {
    let newmessage=message
    const sendMessage = async () => {
      try {
        const message = await prisma.message.create({
          data: newmessage,
        });
      } catch (error) {
        console.log(error);
      }
    };
    sendMessage(message)
    io.to(message.conversationId).emit("newMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const port = process.env.PORT || 3000;
server.listen(3000, () => {
  console.log(`app listening on port ${port}`);
});
