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

  router.get('/:id', function(req, res, next) {
    let userId = req.params.id;
    let getUser = "select * from users where id=" + userId;
    clientConnection.query(getUser, function(err, result) {
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

  router.put('/:id', function (req, res) {
    let update = req.body.user;
    let userId = req.params.id;
    let returnQuery= "select * from users where id=" + userId;
    let query=  clientConnection.query('Update users SET firstname=($1), lastname=($2), phone=($3),status=($4),email=($5) where id='+ userId,
     [update.firstname, update.lastname, update.phone, update.status,update.email], function(err, result) {
       if(err) {
       res.status(500).send({
           "status":"500","code":"90402","userMessage":"Error","developerMessage":err
         });
       }
       else {
         clientConnection.query(returnQuery , function (err, result) {
           if(err) {
           res.status(500).send({
               "status":"500","code":"90402","userMessage":"Error","developerMessage":err
             });
           }
           else {
            res.status(200).send({orders : result.rows});
          }
         });
       }
    });
  });

  router.post('/', function(req, res, next) {
    let user= req.body.user;
    let userId='nextval('+ "\'id\'"+ ')';
    let curr_id='currval('+ "\'id\'" + ')';
    console.log(user);
    let createUser = 'insert into users values('  +user.phone + ',' + '\'' + user.firstname+ '\'' + ','+ '\'' + user.lastname+ '\'' + ',' + '\''+ user.email+ '\'' + ',' + user.status+ ','  + userId + ')';
    let fetchUser = 'select * from users where id=' + curr_id;
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
    let deleteRequest = "delete from users where id="+ userId;
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
