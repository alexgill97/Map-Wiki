const express = require('express');
const router = express.Router();
const cookieSession = require('cookie-session');
const { getCoords, postCoordsToDB, getFavs } = require('./helper_functions');
const bodyParser = require('body-parser');

module.exports = (db) => {
  // ------ Update A Map ------
  router.post('/', (req, res) => {

    let templateVars = {
      user: req.session.id,
      user_maps: req.session.map,
      fav_maps: req.session.favs,
      name: req.session.name,
      map_id: req.session.map_id
     };


    const user_id = req.session.id;

    const { currentMapId, title, description } = req.body;

    let queryString = `
    UPDATE maps
    SET title = $1, description = $2, last_edited_on = now()::date, last_edited_by = $3
    WHERE id = $4;
    `;
    db.query(queryString, [title, description, user_id, currentMapId]).then(
      () => {
          getFavs(user_id, db).then(()=> {

            templateVars = {
             user: req.session.id,
             user_maps: req.session.map,
             fav_maps: req.session.favs,
             name: req.session.name,
             map_id: req.session.map_id
            };

           res.render('index', templateVars);
          })
      });
  });
  return router;
}
