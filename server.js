const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const mongodb = require('./db/connect');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger.json');

const app = express();
const port = process.env.PORT || 8080;
const isProduction = process.env.NODE_ENV === 'production';
const baseUrl = isProduction ? process.env.BASE_URL : `http://localhost:${port}`;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] }));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Routes
app.use('/', require('./routes'));

// GitHub OAuth Setup
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL
}, function (accessToken, refreshToken, profile, done) {
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Auth Callback
app.get('/auth/github/callback', passport.authenticate('github', {
  failureRedirect: '/api-docs',
  session: false
}), (req, res) => {
  req.session.user = req.user;
  res.redirect('/');
});

// Root endpoint
app.get('/', (req, res) => {
  const user = req.session.user;
  res.send(user ? `Logged in as ${user.displayName}` : 'Logged out');
});

// Error handler
const { errorHandler } = require('./middleware/errorHandler');
app.use(errorHandler);

// Start server after DB connection
mongodb.initDb((err) => {
  if (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  } else {
    app.listen(port, () => {
      console.log(`Connected to DB and server running on ${baseUrl}`);
      console.log(`Documentation available at ${baseUrl}/api-docs`);
    });
  }
});
