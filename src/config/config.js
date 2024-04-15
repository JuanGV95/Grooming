export default {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 8080,
    mongodbUri: process.env.MONGODB_URI,
    jwt: process.env.JWT_SECRET,
    jwtRecovery: process.env.JWT_RECOVERY,
    cookie: process.env.COOKIE_SECRET,
    persistence: process.env.PERSISTENCE || 'memory',
    recoveryLink: process.env.RECOVERY_LINK || 'http://localhost:8080/recovery/', 
    mail: {
      emailService: process.env.EMAIL_SERVICE || 'gmail',
      emailPort: process.env.EMAIL_PORT || 587,
      emailUser: process.env.EMAIL_USER,
      emailPassword: process.env.EMAIL_PASSWORD,
    },
  };