/**
 * Created by eduardo on 07/09/14.
 */
'use strict';

var mongoose = require('mongoose'),
    Municipio = mongoose.model('Municipio'),
    url = require('url'),
    importa = require(__base + 'crawler/ImportaMunicipio');

    exports.municipios = function(req, res) {
        // Parsing da URL
        var parsed_url = url.parse(req.url, true);

        // Try to find Município by the last URL
        var last_url = parsed_url.path.substr(parsed_url.path.lastIndexOf('/') + 1);

        Municipio.findOne({_id: last_url }, function(err, municipio) {
            if (municipio != null) {
                var ano = ['2008', '2009', '2010', '2011', '2012', '2013'];
                console.log("Tratando município "+municipio.nome);
                ano.forEach(function(entry) {
                    console.log("Iniciando ano " + entry);
                    var importador = new importa.ImportaMunicipio(entry, municipio);
                    importador.updateMunicipio();
                    console.log("Finalizando ano " + entry);
                });

                //res.headers = {'content-type': 'application/json'};
                res.json(municipio);
                //res.send(200);
            } else {
                res.body = "Erro no import dos municípios";
                res.send(500);
            }
        });




    };