arcserver-traversaur
====================

Recursively traverse all of the published services from an ArcGIS Server

## Install

`$ npm install arcserver-traversaur`

## Usage

Easily discover all of the map services currently available from the identified ArcGIS Server.  Use it to collect and save all of the endpoints in your favorite datastore.

#### Example

```js
var traversaur = require('arcserver-traversaur');

var ArcServerRestEnpoint = 'http://services.nationalmap.gov/arcgis/rest/services?f=pjson';

// Using with a callback
traversaur(ArcServerRestEndpoint, function(err, result) {
  if (err) return err; // handle error

  // handle result
});

// Using with a promise
traversaur(ArcServerRestEndpoint)
  .then(function(result) {
    // handle result
  })
  .catch(function(err) {
    // handle error
  });
```

## Contact

Andy B
