import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/routes';
import { connectToMongoDB } from './config/config';
import { createServer } from 'http';
import { Server as serverSocket } from 'socket.io';
import { socketHandler } from './utils/socket';




const app = express();
const PORT = 8000;

connectToMongoDB();

const httpServer = createServer(app);
const allowedOrigins = ['http://localhost:3000']; 

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, 
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  })
);


export const io = new serverSocket(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
  }
});


socketHandler(io);

app.use(express.json());
app.use(cookieParser());


app.use('/user', userRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});
