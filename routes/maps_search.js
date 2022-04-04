const express = require('express');
const router = express.Router();
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const { getMapByLike } = require('./helper_functions');

module.exports = (db) => {
  router.post('/', (req, res) => {
    console.log('HELLO');
    res.redirect('/');

    const search = getMapByLike(title, db);
    search.then((data) => {
      console.log(hello);
      // res.render();
    });
    res.redirect('index');
  });

  return router;
};
