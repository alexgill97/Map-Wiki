// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const app = express();
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  '/styles',
  sassMiddleware({
    source: __dirname + '/styles',
    destination: __dirname + '/public/styles',
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static('public'));

app.use(
  cookieSession({
    name: 'session',
    keys: ['key1', 'key2', 'key3'],

    maxAge: 24 * 60 * 60 * 1000,
  })
);

// ------- Routes required -------

const indexRoute = require('./routes/index');
const loginRoute = require('./routes/login');
const usersRoute = require('./routes/users');

const map_createRoute = require("./routes/create_map");
const map_listRoute = require('./routes/map_list');
const mapsSearchRoute = require('./routes/maps_search');
const mapWithCoords = require('./routes/coords');
const updateMap = require('./routes/map_update');
const addMapToFav = require('./routes/add_fav');

// ------- Routes Mounted -------

app.use('/login', loginRoute(db));
app.use('/api/users', usersRoute(db));
app.use("/create_map", map_createRoute(db));
app.use('/map_list', map_listRoute(db));
app.use('/maps/maps_search', mapsSearchRoute(db));
app.use('/coords_post', mapWithCoords(db));
app.use('/map_update', updateMap(db));
app.use('/add_fav', addMapToFav(db));
app.use('/', indexRoute(db));

// ------- Server Mounted -------

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
