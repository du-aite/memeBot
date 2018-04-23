var Discord = require('discord.io');
var auth = require('./auth.json');
var tocadorDeAudios = require('./tocarAudios.js');

//MyAnimeList
const myAnimeListUser = 'MemeBOT';
const myAnimeListPassword = 'Memebot123.';
var http = require('http');
var htmlToText = require('html-to-text');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

//AUTH 

var bot = new Discord.Client({
  token: "NDM1MjAxODk1MzQzMzI1MTk0.DbVtlA.5NUFYA5yNnbA6IFWC-z1pHIqSv4",
  autorun: true
});

//BOT Connected
bot.on('ready', () => {

  console.log('Rodando!');
  bot.sendMessage({
    to: "74550791179874304",
    message: "ATENCAO \nTO ON!"
  });
});

//Command Management
bot.on("message", function (user, userID, channelID, message, rawEvent) {
  if (message.substring(0, 1) == "!") {

    var command = message.substring(1);

    //Manda mensagens de texto
    if (command == "batata") {
      bot.sendMessage({
        to: channelID,
        message: "Eu, " + user + ", comandei o bot a chamar uma Batata. Útil pra caralho."
      });
    }

    //Procura anime

    if (command.startsWith('anime')) {

      var splitContent = command.trim().split(' ');
      var nomeAnime = '';
      for (i = 1; i < splitContent.length; i++) {
        if (splitContent[i] != '') {
          nomeAnime += splitContent[i];

          if (i != (splitContent.length - 1)) {
            nomeAnime += '+';
          }
        }
      }
      nomeAnime = nomeAnime.trim();
      console.log('nomeAnime : ' + nomeAnime);
      searchAnime(channelID, nomeAnime);
    }

    //Manda imagens
    if (command == "frog") {
      bot.uploadFile({
        to: channelID,
        file: 'imgs/sapo.jpg'
      });
    }

    //Chama a classe TocadorDeAudios
    tocadorDeAudios.tocarAudiosFuncao(userID, command, bot);

  }
});

//PROCURAR ANIME ----> MODULARIZAR
function searchAnime(channel, nomeAnime) {
  var auth = new Buffer(myAnimeListUser + ':' + myAnimeListPassword).toString('base64');
  var options = {
    host: 'myanimelist.net',
    port: 80,
    path: '/api/anime/search.xml?q=' + nomeAnime,
    headers: {
      'Authorization': 'Basic ' + auth
    }
  };

  http.get(options, (res) => {
    var completeResponse = '';

    res.on('data', function (chunk) {
      completeResponse += chunk;
      console.log('chunk: ' + completeResponse);
    });

    res.on('end', function () {

      parser.parseString(completeResponse, function (err, result) {

        var anime = result.anime.entry[0];
        console.log('anime: ' + anime + '| titulo : ' + titulo);
        var titulo = anime.title[0];
        var episodios = anime.episodes[0];
        var status = anime.status[0];
        var score = anime.score[0];
        var sinopse = htmlToText.fromString(anime.synopsis[0], {
          wordwrap: null
        });
        var id = anime.id[0];

        // In Memory Of 
        // split(/[\u005b\u005d]/)[1] pra pegar uma string entre [ ]

        var mensagem = '**Titulo: **' + titulo + '\n'
          + '**Episodios: **' + episodios + '\n'
          + '**Status: **' + status + '\n'
          + '**Score: **' + score + '\n'
          + '**Sinopse: **' + sinopse + '\n'
          + 'http://myanimelist.net/anime/' + id + '\n';

        channel.sendMessage(mensagem);

      });
    }
    );
  }
  )
}