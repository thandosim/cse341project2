const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongodb = require('./db/connect');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
// const { swaggerUi, swaggerSpec } = require('./swagger');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger.json'); 

const app = express();
app.use(express.json()); // Parse JSON bodies

const port = process.env.PORT || 8080;
// const baseUrl = process.env.BASE_URL || `http://localhost:${port}`
const isProduction = process.env.NODE_ENV === 'production';
const baseUrl = isProduction ? process.env.BASE_URL : `http://localhost:${port}`;

app.use(cors());
app.use(session({
  secret:"secret",
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(
  (req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
  }
);
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use('/', require('./routes'));
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL
}, 
function(accessToken, refreshToken, profile, done) {
  // Here you would typically save the user profile to your database
  // For now, we just return the profile
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get('/', (req,res) => {
  req.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : 'Logged out'

  )});

app.get('/github/callback', passport.authenticate('github', { 
  failureRedirect: '/api-docs',session:false }),
  (req,res) => {
    req.session.user = req.user;
    res.redirect('/');
  }
);

// Error Handler
const {errorHandler} = require('./middleware/errorHandler');
app.use(errorHandler);

// Only start server after DB connection
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