const express = require('express');
const router = express.Router();
const cookieSession = require('cookie-session');
const {
  getAllMaps,
  getUserMaps,
  getMapByLike,
  getFavs,
  getCoords,
  getMapCoordsByTitle,
  addFav,
  getNameFromDB,
  getMapByTitle,
  addCoordsByMapId,
} = require('./helper_functions');
const coords = require('./coords');

module.exports = (db) => {
  // ------ Get The Home Page ------
  router.get('/', (req, res) => {

    if (!req.session) {
      res.render('login');
    }

    console.log('BODY-->', req.body)
    const templateVars = {
      user: req.session.id,
      user_maps: req.session.map,
      fav_maps: req.session.favs,
      name: req.session.name,
      map_id: req.session.map_id
    }
console.log('fav_maps --> ', templateVars.fav_maps)
    res.render('index', templateVars);

  });

  // SENDING JSON TO DOM AJAX ///

  router.get('/:mapname', (req, res) => {
    const mapName = req.params;
    let templateVars = {
        user: req.session.id,
        map_id: req.session.map_id,
        user_maps: req.session.map,
        fav_maps: req.session.favs,
        name: req.session.name
        };

    const coords = getMapCoordsByTitle(mapName, db);
    return coords
      .then((coords) => {

        templateVars = {
          user: req.session.id,
          coords: coords,
          map_id: req.session.map_id,
        };
        res.json(templateVars);
      })
      .catch((err) => {
        console.log('err in map name route', err);
      });
  });

  // ------ Get Users Created Maps (List) ------
  router.post('/user_maps', (req, res) => {
    let templateVars = {
       user: req.session.id,
       user_maps: req.session.map,
        fav_maps: req.session.favs
       };
    const user_id = req.session.id;

    // console.log(templateVars, ' Template Vars from /user_maps ');

    const mapList = getUserMaps(user_id, db);
    mapList.then((maps) => {
      templateVars = {
        user: req.session.id,
        maps,
        user_maps: req.session.map,
        fav_maps: req.session.favs
       };

      res.render('index', templateVars);
    });
  });

  // ------ Get Users Favorite Maps (List) ------

  // -------- Make This Map One of Your Favs! ------- ///


  // // ------ Create A Map ------
  // router.post('/create_map', (req, res) => {
  //   const templateVars = {
  //     user: req.session.id,
  //     user_maps: req.session.map,
  //     fav_maps: req.session.favs,
  //     name: req.session.name
  //    };
  //   const user_id = req.session.id;
  //   const { title, description } = req.body;
  //   let queryString = `
  //     INSERT INTO maps (user_id, title, description, date_created)
  //     VALUES ($1, $2, $3, now()::date) RETURNING *;
  //   `;
  //   db.query(queryString, [user_id, title, description]).then((data) => {
  //     mapTitle = data.rows[0].title;
  //     getMapByTitle(mapTitle, db).then((data) => {
  //       coord_id = data[0].id;
  //       addCoordsByMapId(coord_id, user_id, db).then((data) => {

  //         res.render('index', templateVars);
  //       });
  //     });
  //   });
  // });



  // ------ Add Coords ------

  router.post('/coords_post', (req, res) => {
    const templateVars = {
      user: req.session.id,
     };
    const user_id = req.session.id;
    const { title, map_id, latitude, longitude } = req.body;
    postCoordsToDB(title, map_id, user_id, latitude, longitude, db);
  });

  // ------ Logout Handler ------
  router.post('/logout', (req, res) => {
    req.session = null;
    res.redirect('login');
  });

  // ------ Get Searched Map (Single) ------
  router.post('/:map', (req, res) => {
    let templateVars = { user: req.session.id };

    let { title } = req.body;

    const search = getMapByLike(title, db);
    search.then((maps) => {
      templateVars = { user: req.session.id, maps: maps, name: req.session.name, fav_maps: req.session.favs, user_maps: req.session.map };
      res.render('index', templateVars);
    });
  });

  // ------ Get Highest Rated Maps (STRETCH) ------
  router.post('/pop_map', (req, res) => {
    // console.log('maps search');
  });

  return router;
};
