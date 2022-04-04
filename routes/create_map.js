
const express = require('express');
const router = express.Router();
const cookieSession = require('cookie-session');
const { getCoords, postCoordsToDB, getFavs, getMapByTitle, addCoordsByMapId } = require('./helper_functions');
const bodyParser = require('body-parser');

module.exports = (db) => {

router.post('/', (req, res) => {
  const templateVars = {
    user: req.session.id,
    user_maps: req.session.map,
    fav_maps: req.session.favs,
    name: req.session.name
   };
  const user_id = req.session.id;
  const { title, description } = req.body;
  let queryString = `
    INSERT INTO maps (user_id, title, description, date_created)
    VALUES ($1, $2, $3, now()::date) RETURNING *;
  `;
  db.query(queryString, [user_id, title, description]).then((data) => {
    mapTitle = data.rows[0].title;
    getMapByTitle(mapTitle, db).then((data) => {
      coord_id = data[0].id;
      addCoordsByMapId(coord_id, user_id, db).then((data) => {

        res.render('index', templateVars);
      });
    });
  });
});
return router;
};

