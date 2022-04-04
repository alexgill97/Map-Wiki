// ***************** LOGIN/REGI HELPERS *******************//
const checkLogin = function (user, db) {
  return db
    .query(
      `
  SELECT email, id
  FROM users
  WHERE email = $1;
  `,
      [`${user.email}`]
    )
    .then((user) => {
      return user.rows[0];
    })
    .catch((err) => {
      console.log('err', err);
    });
};

const getNameFromDB = function (user_id, db) {
  return db
    .query(
      `
  SELECT name
  FROM users
  WHERE users.id = $1;
  `,
      [user_id]
    )
    .then((user) => {
      return user.rows[0];
    })
    .catch((err) => {
      console.log('err', err);
    });
};

// ******************* MAP HELPERS *********************//
const getAllMaps = function (db) {
  return db
    .query(
      `
  SELECT title
  FROM maps
  LIMIT 5;
  `
    )
    .then((res) => res.rows);
};

// ------ Search For A Map by ID ------
const getMap = function (map, db) {
  return db
    .query(
      `
  SELECT *
  FROM maps
  WHERE id = $1;
  `,
      [map]
    )
    .then((res) => res.rows[0]);
};

// ------ Search For A Map by Title ------
const getMapByLike = function (title, db) {
  return db
    .query(
      `
  SELECT *
  FROM maps
  WHERE title LIKE $1
  LIMIT 5;
  `,
      ['%' + title + '%']
    )

    .then((res) => res.rows)

    .catch((err) => {
      console.log('ERR', err);
    });
};

// ------ Get Maps for User ------
getUserMaps = function (user_id, db) {
  return db
    .query(
      `
    SELECT *
    FROM maps
    WHERE user_id = $1
    LIMIT 5;
  `,
      [user_id]
    )
    .then((res) => res.rows);
};

// ------ Get Favorite Maps for User ------
const getFavs = function (user_id, db) {
  return db
    .query(
      `
  SELECT DISTINCT maps.title
  FROM maps
  JOIN favourite_maps ON maps.user_id = favourite_maps.user_id
  WHERE maps.user_id = $1
  LIMIT 5;
  `,
      [user_id]
    )
    .then((res) => res.rows);
};

// -------- Insert Favourite Map for User ------ //

const addFav = function (user_id, map_id, db) {
  return db
    .query(
      `
      INSERT INTO favourite_maps (user_id, map_id)
      VALUES ($1, $2);
      `,
      [user_id, map_id]
    )
    .then((res) => res.rows);
};

// const insertCoords = function (placeholder, db) {
//   let queryString = (`
//   INSERT INTO coords (title, map_id, user_id, longitude, latitude, description)
//   VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
//   `);
//   return db.query(queryString, [title, map_id, user_id, longitude, latitude, description])
//   .then((data) =>
//    console.log(data);
// )}

// ******************* COORDS HELPERS *********************//

const getCoords = function (map, db) {
  return db
    .query(
      `
    SELECT longitude, latitude
    FROM coords
    WHERE map_id = $1;
  `,
      [map]
    )
    .then((res) => res.rows);
};

const postCoordsToDB = function (title, map_id, user_id, lat, lng, db) {
  return db
    .query(
      `
    INSERT INTO coords (title, map_id, user_id, latitude, longitude)
    VALUES ($1, $2, $3, $4, $5)

  `,
      [title, map_id, user_id, lat, lng]
    )
    .then((res) => res.rows);
};

// DROP TABLE IF EXISTS coords CASCADE;
// CREATE TABLE coords (
//   id SERIAL PRIMARY KEY NOT NULL,
//   title text,
//   map_id INTEGER NOT NULL REFERENCES maps(id) ON DELETE CASCADE,
//   user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//   longitude DECIMAL NOT NULL,
//   latitude DECIMAL NOT NULL,
//   description text
// );

const getMapCoordsByTitle = function (map, db) {
  return db
    .query(
      `
    SELECT coords.*
    FROM coords
    JOIN maps ON maps.id = coords.map_id
    WHERE maps.title = $1;
  `,
      [map.mapname]
    )
    .then((res) => res.rows);
};

const getMapByTitle = function (map_title, db) {
  return db
    .query(
      `
    SELECT id
    FROM maps
    WHERE maps.title = $1;
  `,
      [map_title]
    )
    .then((res) => res.rows);
};

const addCoordsByMapId = function (map_id, user_id, db) {
  return db
    .query(
      `
    INSERT INTO coords (title, map_id, user_id, latitude, longitude)
    VALUES ($1, $2, $3, $4, $5) RETURNING *;
  `,
      ['TEST', map_id, user_id, 40.783456, -12.34354]
    )
    .then((res) => {
      console.log('inside addCoordsByMapId');
      res.rows;
    });
};

// DROP TABLE IF EXISTS coords CASCADE;
// CREATE TABLE coords (
//   id SERIAL PRIMARY KEY NOT NULL,
//   title text,
//   map_id INTEGER REFERENCES maps(id) ON DELETE CASCADE,
//   user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//   latitude DECIMAL NOT NULL,
//   longitude DECIMAL NOT NULL
// );

//********************** LATLNG L00P**********************/

const pinDropper = function (results) {
  return results.map((pin) => {
    return [pin.latitude, pin.longitude, pin.map_id];
  });
};

// console.log(pinDropper(testPins));

// const createMap = function(title, description) {

//   let queryString = (`
//       INSERT INTO maps (user_id, title, description, rating, date_created, last_edited_on, last_edited_by)
//       VALUES ($1, $2, $3, $4, now()::date, now()::date, $5) RETURNING *;
//     `);
//      return db.query(queryString, [user_id, title, description, rating, created_at, last_edited_on, last_edited_by])
//     .then((data) =>
//       res.redirect("./"))
// }

// DROP TABLE IF EXISTS maps CASCADE;
// CREATE TABLE maps (
//   id SERIAL PRIMARY KEY NOT NULL,
//   user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//   title VARCHAR(255),
//   description TEXT,
//   rating SMALLINT NOT NULL DEFAULT 0,
//   date_created DATE NOT NULL,
//   last_edited_on DATE NOT NULL,
//   last_edited_by INTEGER REFERENCES users(id) ON DELETE CASCADE
// );

module.exports = {
  addFav,
  checkLogin,
  getMap,
  getFavs,
  getMapByLike,
  getCoords,
  pinDropper,
  getAllMaps,
  getUserMaps,
  getMapCoordsByTitle,
  postCoordsToDB,
  getNameFromDB,
  getMapByTitle,
  addCoordsByMapId,
};
