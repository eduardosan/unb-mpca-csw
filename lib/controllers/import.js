/**
 * Created by eduardo on 07/09/14.
 */
'use strict';

var mongoose = require('mongoose'),
    Municipio = mongoose.model('Municipio'),
    url = require('url'),
    importa = require('../../crawler/importaMunicipio');

    exports.municipios = function(req, res) {
        //This function determines the how will be the return of queries below
        var funcaoRetorno = function (err, municipio) {
            if (!err) {
                return res.json(municipio);
            } else {
                return res.send(err);
            }
        }

        // Parsing da URL
        var parsed_url = url.parse(res.url, true);

        // Try to find Município by the last URL
        var last_url = parsed_url.lastPathComponent;
        var municipio = Municipio.find({_id: last_url }, funcaoRetorno);

        if (typeof municipio != 'undefined') {

        }

    };