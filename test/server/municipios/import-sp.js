/**
 * Created by eduardo on 02/09/14.
 */

var should = require('should'),
    app = require('../../../server'),
    request = require('supertest'),
    fs = require('fs'),
    assert = require('assert'),
    xmldom = require('xmldom');

describe('GET /import/municipio/540251f1c28567662f27282d', function () {

   it('Testa existência de arquivos de dados', function(done) {
       assert.doesNotThrow(fs.readFile(__dirname+'/../../../data/saude-educacao-sp-2013.xml', function (err, data) {
           if (err) {
               console.log("Erro lendo o arquivo XML de dados original\n"+err);
               throw err;
           }
       }));
   })

   it('Testa parsing do arquivo XML de dados', function(done) {
       fs.readFile(__dirname+'/../../../data/saude-educacao-sp-2013.xml', function (err, data) {
           if (err) {
               console.log("Erro lendo o arquivo XML de dados original\n"+err);
               throw err;
           }
           var Dom = xmldom.DOMParser;
           var doc;
           assert.doesNotThrow(doc = new DOM().parseFromString(data.string));
       });
   })

});