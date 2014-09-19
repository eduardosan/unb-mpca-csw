/**
 * Created by eduardo on 07/09/14.
 */
 var xmldom = require('xmldom'),
    mongoose = require('mongoose'),
    fs = require('fs');


exports.ImportaMunicipio =  function ImportaMunicipio (ano, municipio) {
    this.municipio = municipio;
    this.ano = ano;
};

this.ImportaMunicipio.prototype.getInvestimento = function() {
    console.log("Importando dados do município " + this.municipio._id + " para o ano de " + this.ano);
    //var investimentos =
    var filename = __base + 'data/saude-educacao-sp-'+ this.ano + '.xml';

    dados = fs.readFileSync(filename);

    var DOM = xmldom.DOMParser;
    var doc;
    var despesas;
    var saude;
    var educacao;

    doc = new DOM().parseFromString(dados.toString(), 'text/xml');
    despesas = doc.getElementsByTagName('Descrição_Função2');
    saude = despesas[0].getAttribute('Textbox35');
    educacao = despesas[1].getAttribute('Textbox35');

    this.municipio.investimento_municipal.saude[this.ano] = saude;
    this.municipio.investimento_municipal.educacao[this.ano] = educacao;

    //return {
    //    "saude": saude,
    //    "educacao": educacao
    //}

    //console.log("222222222222222222222222222222222222222222222 "+investimentos);
    //console.log("33333333333333333333333333333333333333333333333333333333: "+ municipio);

};

this.ImportaMunicipio.prototype.updateInvestimento = function() {

    console.log("Atualizando os investimentos municipais em saúde e educação para o município " + this.municipio._id + " para o ano de " + this.ano);

    var investimentos = this.getInvestimento();

    this.municipio.investimento_municipal.saude[this.ano] = investimentos.saude;
    this.municipio.investimento_municipal.educacao[this.ano] = investimentos.educacao;

};

this.ImportaMunicipio.prototype.updateMunicipio = function() {
    console.log("Atualizando o banco de dados para o muncípio " + this.municipio._id + " para o ano de " + this.ano);
    //this.updateInvestimento();
    this.getInvestimento();
    this.municipio.save();
};