'use strict';

var utils = require('../utils/writer.js');
var Default = require('../service/DefaultService');

module.exports.busstops = function busstops (req, res, next) {
  Default.busstops()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.nearstops = function nearstops (req, res, next) {
  var latitude = req.swagger.params['latitude'].value;
  var longitude = req.swagger.params['longitude'].value;
  var radius = req.swagger.params['radius'].value;
  Default.nearstops(latitude,longitude,radius)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
