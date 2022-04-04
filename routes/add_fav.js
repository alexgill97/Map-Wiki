const express = require('express');
const router = express.Router();
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const { checkLogin, addFav, getFavs } = require('./helper_functions');

module.exports = (db) => {
  router.post('/', (req, res) => {
    const user_id = req.session.id;
    const map_id = req.body.currentMapId;

    let favMap = addFav(user_id, map_id, db);
    favMap.then((fav) => {

      getFavs(user_id, db).then((data) => {
        console.log('DATA', data);
        let fav_maps = data;
        console.log('FAV MAPS', fav_maps);
        let templateVars = {
          user: req.session.id,
          user_maps: req.session.map,
          fav_maps: fav_maps,
          name: req.session.name,
        };
        res.render('index', templateVars);

      });
    });
  });
  return router;
};
