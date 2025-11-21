import express from 'express';
import { config as dotenvConfig } from 'dotenv';
import fs from 'fs';
import cors from 'cors';
import cookieParser from "cookie-parser";

import { dbConnectionString } from './config/db.js';

import userRouters from './routers/user.router.js';
import riderRouters from './routers/rider.router.js';
import deviceRouters from './routers/device.router.js';

const secretPath =
  fs.existsSync('/etc/secrets/.env')
    ? '/etc/secrets/.env'
    : '.env';

dotenvConfig({ path: secretPath });

const app=express();

const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === "null")
      return callback(null, false);

    return callback(null, origin);
  },
  credentials: true
}));

app.use("/api/users", userRouters);
app.use("/api/devices", deviceRouters);
app.use("/api/riders", riderRouters);

app.get('/', (req, res) => {
  res.send('Delivery box server is running!');
});

app.listen(PORT, ()=>{
    dbConnectionString();
    console.log("server started at http://localhost:"+PORT);
});