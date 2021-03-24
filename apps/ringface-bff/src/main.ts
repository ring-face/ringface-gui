import { app } from './app/express-app';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
  // console.log("Loaded env", process.env);
}

const port = Number(String(process.env.PORT)) || 3333;


const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Process terminated')
  })
})

server.on('error', console.error);


