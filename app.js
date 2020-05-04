var express = require('express');
var formidable = require('formidable');
var hbs = require('hbs');
var child_process = require('child_process');
var path  = require('path');

const model = require('@magenta/music/node/music_rnn');
const core = require('@magenta/music/node/core');
//require('@tensorflow/tfjs-node');
const globalAny = global;
globalAny.performance = Date;
globalAny.fetch = require('node-fetch');

music_rnn = new model.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/melody_rnn');
music_rnn.initialize();


var app = express();

app.get('/', function (req, res){
    res.render(__dirname + '/templates/main.hbs');
});

app.post('/success', function (req, res){
    var form = new formidable.IncomingForm();
    form.parse(req);
    form.on('fileBegin',function(name, file){
        file.path ='MIDI_FILES/' + file.name;
    });
    form.on('file', function(name, file){
        console.log('New file: ' + file.path);
        var execute = "../midicsv-1.1/midicsv ";
        var new_file = " CSV_FILES/"+ file.name.split('.')[0]+".csv" ;
        console.log('COMMAND: '+ execute + file.path + new_file);
    // child_process.exec(execute + file.path + new_file, [cwd=__dirname], function(error, stdout, stderr){
    //     if (error) {
    //         console.error("error: " + error);
    //         return;
    //     }
    //     console.log('stdout: ' + stdout);
    //     console.error('stderr: ' + stderr);
    // });
    // magenta stuff - generate files
        console.log('Initiated: ' + music_rnn.isInitialized())
    // for file in genereated folder:
        // child_process.exec('python3 move_around.py '+file.name.split('.')[0]);
    // return files to user
    });
    // res.render('zip of the files?')
    res.render(__dirname + '/templates/success.hbs');
});


app.get('/choose', function(req, res){
   res.render(__dirname+'/templates/choose.hbs');
});

app.post('/choose', function(req, res){
    res.render('zip of the files?');
});

app.listen(12375);
