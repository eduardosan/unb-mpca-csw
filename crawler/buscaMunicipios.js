var request = require('request'),
   cheerio = require('cheerio'),
   async = require('async'),
   mongoose = require ('mongoose'),
   format = require('util').format;

//mongoose.connect('mongodb://localhost/unb_csw');
//var db = mongoose.connection;

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Application Config
var config = require('../lib/config/config');

// Connect to database
var db = mongoose.connect(config.mongo.uri, config.mongo.options);
var db = db.connection;

var dados = db.collection('municipios');
dados.remove({},function(err,numRem){
           console.log('limpa o banco antes de inserir os municipios: ' + numRem);
});
db.on('error', console.error);
db.once('open', function() {
	console.log('Conectado ao MongoDB.');
		
	var municipio = mongoose.model('municipio', { nome: String, cod: String,  uf: String });
			
	var ufs = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO'
			 , 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI'
			 , 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']
		, concurrency = 1;

	var qtde = "";

	async.eachLimit(ufs, concurrency, function (uf, next) {
		var url = format('http://portaldatransparencia.gov.br/PortalTransparenciaListaCidades.asp?Exercicio=2013&SelecaoUF=1&SiglaUF=%s#', uf);
		request(url, function (err, response, body) {
			if (err) {
                throw err;
            }
			var $ = cheerio.load(body);
			$('p[class="paginaAtual"]').each(function () { 
				var numpag = ($(this).text()).trim();	
				var buscapag = numpag.match(/\//);
				qtde = numpag.substring(buscapag.index + 1, numpag.lenght);
				for (n=1; n<=qtde; n++){
					npgs = n.toString();
					var url = format('http://portaldatransparencia.gov.br/PortalTransparenciaListaCidades.asp?Exercicio=2013&SelecaoUF=1&SiglaUF=%s&Pagina=%s#',uf, npgs.toString());
					request(url, function (err, response, body) {
						if (err)
							throw err;
						var $ = cheerio.load(body);
						$('a[href^="PortalTransparenciaListaAcoes.asp"]').each(function () {
							var href = $(this).attr('href');
							var nome = ($(this).text()).trim();	
							var busca = href.match(/CodMun/);
							var cod = href.substring(busca.index + 7, busca.index + 11);
							var entrada = new municipio({ nome: nome, cod: cod, uf: uf});
							entrada.save(function(err){
								if(err) 
									throw err;
								console.log('SALVO com sucesso: %s - %s - %s', uf, nome, cod);
							});							
						});
						next();
					});
				}
			});
		    next();
		});
	});
});
