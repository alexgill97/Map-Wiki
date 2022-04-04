const express = require('express');
const router = express.Router();
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const {
  getAllMaps,
  getUserMaps,
  getMapByLike,
  getFavs,
  getCoords,
  getMapCoordsByTitle,
  addFav,
  checkLogin,
  getNameFromDB,
} = require('./helper_functions');

module.exports = (db) => {
  router.get('/', (req, res) => {
    res.render('login');
  });

  router.get('/register', (req, res) => {
    res.render('login');
  });

  router.post('/register', (req, res) => {
    const isEmailInDb = checkLogin(req.body, db);
    isEmailInDb.then((data) => {
      if (data) {
        res
          .status(400)
          .send('Email already registered, Please <a href="/login">login!</a>');
        return;
      } else {
        let queryString = `
        INSERT INTO users (name, email, password, date_created)
        VALUES ($1, $2, $3, now()::date) RETURNING *;
  `;
        db.query(queryString, [
          req.body.name,
          req.body.email,
          req.body.password,
        ]).then((data) => {
          req.session.id = data.rows[0].id;
          const templateVars = { user: req.session.id };
          res.render('index', templateVars);
          return;
        });
      }
    });
  });

  router.post('/login', (req, res) => {
    const isEmailInDb = checkLogin(req.body, db);
    isEmailInDb
      .then((data) => {
        req.session.id = data.id;
        templateVars = { user: req.session.id };
        const user_id = req.session.id;
        getNameFromDB(user_id, db).then((name) => {
          req.session.name = name;
        });
        getUserMaps(user_id, db).then((maps) => {
          req.session.map = maps;
        });
        getFavs(user_id, db).then((favs) => {
          console.log('IN LOGIN', favs);
          req.session.favs = favs;
          const templateVars = {
            user: req.session.id,
            user_maps: req.session.map,
            fav_maps: favs,
            name: req.session.name,
          };
          console.log('LOGIN =====>', templateVars);
          res.render('index', templateVars);
          return;
        });
      })
      .catch((err) => {
        res
          .status(400)
          .send('Email not registered, Please <a href="/login">register!</a>');
        return;
      });
  });

  return router;
};
