const path = require('path');

const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const csurf = require('csurf');
const flash = require('connect-flash');

const app = express();

const csrf = require('./middlewares/csrf');
const stealth = require('./middlewares/stealth');
const mainRoutes = require('./routes/main');
const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');
const errorController = require('./controllers/error');
const db = require('./utils/database');
require('./helpers/relations');

app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());
app.use(
  session({
    store: new SequelizeStore({ db }),
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(csurf());
app.use(flash());
app.use(csrf);
app.use(stealth);
app.use(mainRoutes);
app.use('/posts', postRoutes);
app.use('/profile', userRoutes);
app.use(errorController.eNotFound);
app.use(errorController.eInternalServerError);

async function start(port) {
  app.locals.title = 'xpresson';
  try {
    await db.sync();
    await new Promise((resolve, reject) => {
      app.listen(port, resolve);
    });
    console.log(`Server is up & running on port ${port}...`);
  } catch (error) {
    console.error(error);
  }
}
start(process.env.PORT || 4444);
