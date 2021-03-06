'use strict';

var chai = require('chai');
var expect = chai.expect;

var traversaur = require('../');

var serverUrl = 'http://services.nationalmap.gov/arcgis/rest/services?f=pjson';
var endpointUrl = 'http://services.nationalmap.gov/arcgis/rest/services/WFS/transportation/MapServer?f=pjson';

describe('traversaur ArcServer', function() {
	it('should successfully traversaur with a promise', function() {
		return traversaur(serverUrl)
			.then(function(result) {
				expect(result.statusCode).to.equal(200);
				expect(result).to.be.instanceof(Object);
				expect(result.currentVersion).to.be.a('number');
				expect(result.url).to.be.a('string');
				expect(result.folders).to.be.an('array');
				expect(result.endpoints).to.be.an('array');
				expect(result.folders.length).to.be.greaterThan(0);
				return expect(result.endpoints.length).to.be.greaterThan(0);
			});
	});

	it('should successfully traversaur with a callback', function(done) {
		traversaur(serverUrl, function(err, result) {
			expect(result.statusCode).to.equal(200);
			expect(result).to.be.instanceof(Object);
			expect(result.currentVersion).to.be.a('number');
			expect(result.url).to.be.a('string');
			expect(result.folders).to.be.an('array');
			expect(result.endpoints).to.be.an('array');
			expect(result.folders.length).to.be.greaterThan(0);
			expect(result.endpoints.length).to.be.greaterThan(0);
			done(err);
		});
	});
});

describe('traversaur.getEndpoint', function() {
	it('should successfully get endpoint json with a promise', function() {
		return traversaur.getEndpoint(endpointUrl)
			.then(function(result) {
				expect(result.statusCode).to.equal(200);
				expect(result).to.be.instanceof(Object);
				expect(result.currentVersion).to.be.a('number');
				return expect(result.url).to.be.a('string');
			});
	});

	it('should successfully get endpoint json with a callback', function(done) {
		traversaur(serverUrl, function(err, result) {
			expect(result.statusCode).to.equal(200);
			expect(result).to.be.instanceof(Object);
			expect(result.currentVersion).to.be.a('number');
			expect(result.url).to.be.a('string');
			done(err);
		});
	});
});
