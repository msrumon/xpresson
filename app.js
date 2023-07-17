import path from 'path';

import compression from 'compression';
import connectFlash from 'connect-flash';
import connectSessionSequelize from 'connect-session-sequelize';
import csurf from 'csurf';
import express from 'express';
import expressSession from 'express-session';
import helmet from 'helmet';

import * as errorController from './controllers/error.js';
import csrf from './middlewares/csrf.js';
import stealth from './middlewares/stealth.js';
import mainRoutes from './routes/main.js';
import postRoutes from './routes/post.js';
import userRoutes from './routes/user.js';
import db from './utils/database.js';

import './helpers/relations.js';

const app = express();
const SequelizeStore = connectSessionSequelize(expressSession.Store);

app.set('view engine', 'pug');

app.use(express.static(path.resolve('public')));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());
app.use(
  expressSession({
    store: new SequelizeStore({ db }),
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(csurf());
app.use(connectFlash());
app.use(csrf);
app.use(stealth);
app.use(mainRoutes);
app.use('/posts', postRoutes);
app.use('/profile', userRoutes);
app.use(errorController.eNotFound);
app.use(errorController.eInternalServerError);

async function start(port) {
  app.locals.title = 'xpresson';
  await db.sync();
  await new Promise((resolve, _reject) => {
    app.listen(port, resolve);
  });
  return `Application is running on port ${port}...`;
}

start(process.env.PORT).then(console.log).catch(console.error);
