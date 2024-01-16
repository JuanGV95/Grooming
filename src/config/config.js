export default {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 8080,
    mongodbUri: process.env.MONGODB_URI,
    jwt: process.env.JWT_SECRET,
    cookie: process.env.COOKIE_SECRET,
    persistence: process.env.PERSISTENCE || 'memory', 
  };