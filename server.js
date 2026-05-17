import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import http from 'http';
import { Server } from 'socket.io';

import connectDb from './config/db.js'
import authRoutes from './routes/auth.route.js'
import gigRoutes from './routes/gig.routes.js'
import bidRoutes from './routes/bid.route.js'

dotenv.config()
connectDb();

const app = express();

app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
  'http://localhost:5173',
  'https://account-manager-vite.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);



app.get('/', (_, res) => { res.send("API is running") })
app.use('/api/auth', authRoutes)
app.use('/api/gigs', gigRoutes)
app.use('/api/bids', bidRoutes)


// HTTP SERVER and Socket

const server = http.createServer(app)
export const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'https://account-manager-vite.vercel.app',
    ],
    credentials: true,
  },
});


io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});