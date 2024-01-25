import http from 'http';
import app from './app.js';
import { init as initSocket } from './socket.js';
import { init } from './db/mongodb.js';
import config from './config/config.js';

if(config.persistence === 'mongodb'){
await init();
}

const server = http.createServer(app);

initSocket(server);

const PORT = config.port;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} 🚀`);
});