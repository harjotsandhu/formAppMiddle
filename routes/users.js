var express = require('express');
var router = express.Router();
var db = require('../db');

let clientConnection;
db.pool.connect(function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  clientConnection=client;
});
let getUsers= "select * from users";
/* GET users listing. */
router.get('/', function(req, res, next) {
  clientConnection.query(getUsers, function(err, result) {
    if(err) {
    res.status(500).send({
        "status":"500","code":"90402","userMessage":"Error","developerMessage":err
      });
    }
    else {
      let data=[];
         result.rows.forEach( function(row) {
           data.push(row);
         });
         res.status(200).send({users : data});
       }
    });
  });

module.exports = router;
