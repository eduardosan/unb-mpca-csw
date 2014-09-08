/**
 * Created by eduardo on 02/09/14.
 */

var should = require('should'),
    app = require('../../../server'),
    request = require('supertest'),
    fs = require('fs'),
    assert = require('assert'),
    xmldom = require('xmldom'),
    mongoose = require('mongoose'),
    Municipio = mongoose.model('Municipio');

describe('GET /import/municipios/540bcaf454ccaf3175170623', function () {

    it('Só pra ver se o teste está funcionando', function() {
        var retval = true;

        assert.equal(true, retval);
    })

   it('Testa existência de arquivos de dados', function() {
       assert.doesNotThrow(function() {
           fs.readFile(__dirname+'/../../../data/saude-educacao-sp-2013.xml', function (err, data) {
               if (err) {
                   console.log("Erro lendo o arquivo XML de dados original\n"+err);
                   throw err;
               }
            });
       });
   })

   it('Testa parsing do arquivo XML de dados', function() {
       fs.readFile(__dirname+'/../../../data/saude-educacao-sp-2013.xml', function (err, data) {
           if (err) {
               console.log("Erro lendo o arquivo XML de dados original\n"+err);
               throw err;
           }
           var DOM = xmldom.DOMParser;
           var doc;
           assert.doesNotThrow(function() {
               doc = new DOM().parseFromString(data.string);
           });
       });
   })

   it('Encontra dados de saúde e educação dentro de um arquivo XML', function() {
       fs.readFile(__dirname+'/../../../data/saude-educacao-sp-2013.xml', function (err, data) {
           if (err) {
               console.log("Erro lendo o arquivo XML de dados original\n"+err);
               throw err;
           }
           var DOM = xmldom.DOMParser;
           var doc;
           var despesas;
           var saude;
           var educacao;

           doc = new DOM().parseFromString(data.toString(), 'text/xml');
           despesas = doc.getElementsByTagName('Descrição_Função2');
           saude = despesas[0].getAttribute('Textbox35');
           educacao = despesas[1].getAttribute('Textbox35');
           assert.equal(saude, '5963902681.7');
           assert.equal(educacao, '8111898059.3');
       });


   })

   it('Carrega dados do Município', function(done) {
       request(app)
           .get('/api/municipios?id=540bcaf454ccaf3175170623')
           .expect(200)
           .expect('Content-Type', /json/)
           .end(function(err, res) {
               if (err) return done(err);
               res.body.should.be.instanceof(Array);
               //console.log(JSON.parse(res.body));
               if(res.body[0].nome == 'SAO PAULO' &&
                   res.body[0].cod == '7107' &&
                   res.body[0].uf == 'SP')
               //res.body[0]._id == '5353fd784d2bc7ed64289af7' &&
               //res.body[0].__v == 0)
                   console.log('Município encontrado com sucesso');
               done();
           });
   })

   it("Adiciona dados de saúde no Município selecionado", function(done) {
       request(app)
           .get('/import/municipios/540bcaf454ccaf3175170623')
           .expect(200)
           .expect('Content-Type', /json/)
           .end(function(err, res) {
               if (err) return done(err);
               res.body.should.be.instanceof(Array);
               //console.log(JSON.parse(res.body));
               if(res.body[0].nome == 'SAO PAULO' &&
                   res.body[0].cod == '7107' &&
                   res.body[0].uf == 'SP')
               //res.body[0]._id == '5353fd784d2bc7ed64289af7' &&
               //res.body[0].__v == 0)
                   console.log('Município encontrado com sucesso');

               municipio = res.body[0];
               assert.equal(municipio.investimento_municipal.saude[2013], '5963902681.7');
               assert.equal(municipio.investimento_municipal.educacao[2013], '8111898059.3');
               done();
           });
   })

});