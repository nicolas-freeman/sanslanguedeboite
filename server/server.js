const express = require('express');
const app = express();

//app.get('/', function (req, res) {
//  res.send('Hello World!')
//});

app.use(express.static('./../static'));

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/sanslanguedeboite';

// Use connect method to connect to the Server

app.listen(3000, function () {
  console.log('Sans langue de boite listening on port 3000!');
});

// Requête de la liste des entreprises
app.get('/companiesList', function (req, res) {
  console.log("J'ai reçu une requête !");

  MongoClient.connect(url, function (err, client) {
    if (err) {
      return res.status(500).send(err);
    }
    console.log("Connecté à la base de données située à l'adresse " + url);
    var db = client.db('sanslanguedeboite');


    db.collection('entreprises').find({}).toArray(function (findErr, result) {
      if (findErr) throw findErr;
      client.close();
      console.log("Voici la liste des entreprises...");
      res.send(result);
    });

  });
});

app.get('*', function (req, res) {
  console.log("req.query.recherche =" + req.query.recherche);
});

