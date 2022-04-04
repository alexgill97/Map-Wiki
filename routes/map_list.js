const express = require('express');
const router = express.Router();
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const { getAllMaps } = require('./helper_functions');





module.exports = (db) => {


  router.post('/', (req, res) => {

    let templateVars = null;

    mapList = getAllMaps(db)
    mapList.then(data => {

      templateVars = { map: data }
    })
    console.log(templateVars)



    return res.render('maps', templateVars);

  })

  return router;
}

// Render multiple maps associated with a users id

// module.exports = (db) => {

//   router.post('/', (req, res) => {
//     let templateVars = null;
//     userMapList = getAllMaps(db)
//     favMapList = getFavs(db)
//     Promise.all([userMapList, favMapList]).then(data => {
//       templateVars = {userMaps: data[0].rows, userFavMaps: data[1].rows}
//     })
//     console.log(templateVars)
//     return res.render('maps', templateVars);
//   })
//   return router;
// }

