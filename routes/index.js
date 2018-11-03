var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/Tododb');

var iceCream = new Schema({
  name: { type: String},
  flavor: {type: String},
  price: {type: String},
  date: {
    type: Date,
    default: Date.now
  }
});

var data = mongoose.model('Tasks', iceCream);

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/get-data', function(req, res, next) {
  data.find()
      .then(function(doc) {
        res.render('index', {items: doc});
      });
});

router.post('/insert', function(req, res, next) {
  var item = {
    name: req.body.name,
    flavor: req.body.flavor,
    price: req.body.price
  };
  
  var s = new data(item);
  s.save();

  res.redirect('/get-data');
});

router.post('/update', function(req, res, next) {

  data.update({id: req.body._id}, {
    name : req.body.name,
    flavor : req.body.flavor,
    price: req.body.price
}, function(err, obj) {
    if (!err) {
        res.redirect('/get-data');}
    else {
        res.send(err)
    }
});
});

router.post('/delete', function(req, res, next) {
  data.deleteOne({id: req.params._id},
    function(err,obj){
      if (err){
        res.status(404);
        res.send(err);
      }
      res.redirect('/get-data');
    });
});

module.exports = router;