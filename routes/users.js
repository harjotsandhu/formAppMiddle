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
           row.id = row.phone;
           data.push(row);
         });
         res.status(200).send({users : data});
       }
    });
  });

  router.post('/', function(req, res, next) {
    let user= req.body.user;
    console.log(user);
    let createUser = 'insert into users values('  +user.phone + ',' + '\'' + user.firstname+ '\'' + ','+ '\'' + user.lastname+ '\'' + ',' + '\''+ user.email+ '\'' + ',' + user.status + ')';
    let fetchUser = 'select * from users where phone=' + user.phone;
    clientConnection.query(createUser, function(err, result) {
      console.log(createUser);
      if(err) {
      res.status(500).send({
          "status":"500","code":"90402","userMessage":"Error","developerMessage":err
        });
      }
      else {
        clientConnection.query(fetchUser, function(err, result) {
          if (err) {
            res.status(500).send({
                "status":"500","code":"90402","userMessage":"Error","developerMessage":err
              });
          }
          else{
          let data=[];
             result.rows.forEach( function(row) {
               row.id=1;
               console.log(row);
               data.push(row);
             });
             res.status(200).send({users : data});
           }
          });
        }
      });
    });
  router.delete('/:id', function(req, res, next) {
    let userId= req.params.id;
    let deleteRequest = "delete from users where phone="+ userId;
    console.log(deleteRequest);
    clientConnection.query(deleteRequest, function(err, result) {
      if(err) {
      res.status(409).send({
          "status":"409","code":"90402","userMessage":"cannot delete","developerMessage":err
        });
      }
      else {
       return res.status(204).end();
      }
    });
  });

module.exports = router;
