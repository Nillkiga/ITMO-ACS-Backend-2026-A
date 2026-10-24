const express = require('express');
const httpProxy = require('express-http-proxy');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const config = require('./config.json');

const app = express();
app.use(cors());
app.use(express.json());

// Защищённые маршруты
app.use((req, res, next) => {
  const isProtected = config.protectedRoutes.some(route => {
    if (route.endsWith('/*')) {
      return req.path.startsWith(route.slice(0, -2));
    }
    return req.path === route;
  });

  if (isProtected) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: no token provided' });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      req.user = decoded.user;
      next();
    } catch (err) {
      return res.status(403).json({ message: 'Forbidden: invalid token' });
    }
  } else {
    next();
  }
});

// Прокси для каждого маршрута
Object.entries(config.routes).forEach(([route, target]) => {
  app.use(route, httpProxy(target, {
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      if (srcReq.user) {
        proxyReqOpts.headers['X-User-Id'] = srcReq.user.id;
      }
      return proxyReqOpts;
    },
    proxyErrorHandler: (err, res, next) => {
      res.status(503).json({ message: 'Service unavailable', error: err.message });
    }
  }));
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Gateway running on port ${PORT}`));