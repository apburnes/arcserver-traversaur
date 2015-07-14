'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var request = Promise.promisifyAll(require('request').defaults({json: true}));


/**
* Recursively traverse the ArcGIS Server REST Endpoints
* @function traversaur
* @param {string} serverURL - An ArcGIS Server Root JSON Format URL
* @param [object] attributes - Optional object to add to the returned JSON object
* @param [travesaur~requestCallback] callback - An optional request callback
* @return {Object} An object with server info including the endpoints property array of services
*/

function traversaur(serverURL, attributes, callback) {
  if (typeof attributes === 'function') {
    callback = attributes;
    attributes = {};
  }

  var url = serverURL;

  var serverInfo = {
    endpoints: []
  };

  return request.getAsync(url)
    .spread(function(res, result) {
      _.defaults(serverInfo, attributes, {
        url: res.request.href,
        statusCode: res.statusCode,
        folders: result.folders || [],
        currentVersion: result.currentVersion || ''
      });

      return result;
    })
    .then(scan)
    .then(function(){
      return serverInfo;
    })
    .nodeify(callback, {spread: true});

    function scan(result) {
      var url = serverInfo.url;

      var subFolders = _.map(result, function(value, key) {
        if (key === 'services' && value.length > 0) {
          var serviceUrls = _.map(value, function(service) {
            var serviceUrl = buildServiceUrl(url, service);
            serverInfo.endpoints.push(serviceUrl);
            return;
          });
        }

        if (key === 'folders' && value.length > 0) {
          var folderUrls = _.map(value, function(folder) {
            return buildFolderUrl(url, folder);
          });

          return folderUrls;
        }

        return;
      });

      var subRequests = _.compact(_.flatten(subFolders));

      if (subRequests.length > 0) {
        return Promise.all(subRequests)
          .map(subProfile)
          .map(scan);
      }
      else {
        return;
      }
    }

    function subProfile(url) {
      return request.getAsync(url)
        .spread(function(res, result) {
          return result;
        });
    }
}

/**
* The optional callback. Returns a promise if not called.
* @callback traversaur~requestCallback
* @param {string} err - The error
* @param {object} result - An object containing the server info
* @param {string} result.url - ArcServer root url
* @param {number} result.currentVersion - ArcServer version
* @param {array} result.folders - ArcServer subfolders with services
* @param {array} result.endpoints - All the services available from the server
*/

/**
* Recursively traverse the ArcGIS Server REST Endpoints
* @function traversaur.getEndpoint
* @param {string} endpointURL - An ArcGIS Server Endpoint JSON Format URL
* @param [object] attributes - Optional object to add to the returned JSON object
* @param [travesau.getEndpointr~requestCallback] callback - An optional request callback
* @return {Object} An object with endpoint info
*/

function getEndpoint(endpointURL, attributes, callback) {
  if (typeof attributes === 'function') {
    callback = attributes;
    attributes = {};
  }

  var url = endpointURL;

  return request.getAsync(url)
    .spread(mergeAttributes)
    .nodeify(callback, {spread: true});

  function mergeAttributes(res, result) {
    return _.assign(result, attributes, {
      statusCode: res.statusCode,
      url: res.request.uri.href || ''
    });
  }
}

/**
* The optional callback. Returns a promise if not called.
* @callback traversaur.getEndpoint~requestCallback
* @param {string} err - The error
* @param {object} result - An object containing the server info
* @param {string} result.url - ArcServer Endpoint Url
* @param {number} result.currentVersion - ArcServer version
* @param {number} result.folders - Response status code
*/

function buildServiceUrl(url, service) {
  var parsed = url.split('?');
  var base = parsed[0];
  var query = parsed[1];

  var name = service.name;
  var type = service.type;

  return base.concat('/', name, '/', type, '?', query);
}

function buildFolderUrl(url, folder) {
  var parsed = url.split('?');
  var base = parsed[0];
  var query = parsed[1];

  return base.concat('/', folder, '?', query);
}

module.exports = traversaur;
module.exports.getEndpoint = getEndpoint;
