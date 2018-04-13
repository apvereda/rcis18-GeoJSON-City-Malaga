'use strict';


/**
 * Returns all the bus stops from Malaga
 *
 * returns List
 **/
exports.busstops = function () {
  return new Promise(function (resolve, reject) {
    var csv = require('csv-stream');
    var request = require('request');


    // All of these arguments are optional.
    var options = {
      delimiter: ',', // default is ,
      endLine: '\n', // default is \n,
      //columns: ['userCodLinea', 'direccion', 'codParada', 'sentido', 'orden', 'lon', 'lat'], // by default read the first line and use values found as columns
      columnOffset: 0, // default is 0
      escapeChar: '"', // default is an empty string
      enclosedChar: '"' // default is an empty string
    }
    var result = []
    var csvStream = csv.createStream(options);
    request('http://datosabiertos.malaga.eu/recursos/transporte/EMT/EMTLineasYParadas/lineasyparadas.csv').pipe(csvStream)
      .on('error', function (err) {

      })
      .on('header', function (columns) {

      })
      .on('data', function (data) {
        // outputs an object containing a set of key/value pair representing a line found in the csv file.
        console.log(data);
        let obj = {
          type: "Feature",
          properties: {
            entity: "Bus Stop",
            line: data.userCodLinea,
            address: data.direccion,
            code: data.codParada,
            direction: data.sentido,
            sequence: data.orden
          },
          geometry: {
            type: "Point",
            coordinates: [data.lon, data.lat]
          }
        }
        result.push(obj)
      })
      .on('column', function (key, value) {
        // outputs the column name associated with the value found

      })
      .on('end', function (key, value) {
        // outputs the column name associated with the value found
        resolve(result)
      })
  });
}


/**
 * Returns the bus stops inside the area specified by the coordinates and the radius
 *
 * latitude String latitude of your position
 * longitude String longitude of your position
 * radius String radius inside you wish to search
 * returns List
 **/
exports.nearstops = function (latitude, longitude, radius) {
  return new Promise(function (resolve, reject) {
    var csv = require('csv-stream');
    var request = require('request');


    // All of these arguments are optional.
    var options = {
      delimiter: ',', // default is ,
      endLine: '\n', // default is \n,
      //columns: ['userCodLinea', 'direccion', 'codParada', 'sentido', 'orden', 'lon', 'lat'], // by default read the first line and use values found as columns
      columnOffset: 0, // default is 0
      escapeChar: '"', // default is an empty string
      enclosedChar: '"' // default is an empty string
    }
    var result = []
    var csvStream = csv.createStream(options);
    request('http://datosabiertos.malaga.eu/recursos/transporte/EMT/EMTLineasYParadas/lineasyparadas.csv').pipe(csvStream)
      .on('error', function (err) {

      })
      .on('header', function (columns) {

      })
      .on('data', function (data) {
        // outputs an object containing a set of key/value pair representing a line found in the csv file.
        console.log(data);
        if (distance(data.lat, latitude, data.lon, longitude, 0.0, 0.0) <= radius) {
          let obj = {
            type: "Feature",
            properties: {
              entity: "Bus Stop",
              line: data.userCodLinea,
              address: data.direccion,
              code: data.codParada,
              direction: data.sentido,
              sequence: data.orden
            },
            geometry: {
              type: "Point",
              coordinates: [data.lon, data.lat]
            }
          }

          result.push(obj)
        }
      })
      .on('column', function (key, value) {
        // outputs the column name associated with the value found

      })
      .on('end', function (key, value) {
        // outputs the column name associated with the value found
        resolve(result)
      })
  });
}

function distance(lat1, lat2, lon1, lon2, el1, el2) {
  const R = 6371; // Radius of the earth

  let latDistance = toRad(lat2 - lat1);
  let lonDistance = toRad(lon2 - lon1);
  let a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
    + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2))
    * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let distance = R * c * 1000; // convert to meters

  let height = el1 - el2;

  distance = Math.pow(distance, 2) + Math.pow(height, 2);

  return Math.sqrt(distance);
}

function toRad(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

