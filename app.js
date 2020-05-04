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
    res.render('pages/main.hbs');
});

app.post('/success', function (req, res){
    var form = new formidable.IncomingForm();
    var thefname = form.parse(req, function(err, fields, files){
	console.log(files.iProducto);
    });
    form.on('fileBegin',function(name, file){
        file.path ='public/MIDI_FILES/' + file.name;
        console.log('New file: ' + file.path);
    });
    form.on('file', function(name, file){
        var execute = "public/midicsv ";
	var fname = file.name.split('.')[0];
        var new_file = " public/CSV_FILES/"+ fname + ".csv" ;
        console.log('COMMAND: '+ execute + file.path + new_file);
    	child_process.exec(execute + file.path + new_file, [cwd=__dirname], function(error, stdout, stderr){
    	    if (error) {
    	       console.error("error: " + error);
    	       return;
            }
    	});
    // magenta stuff - generate files
        console.log('Initiated: ' + music_rnn.isInitialized())
    // for file in genereated folder:
        // child_process.exec('python3 move_around.py ' + fname );
    // return files to user
    return fname;
    });
    console.log('Does it work:' + thefname);
    // res.render('zip of the files?')
    res.render('pages/success.hbs');
});


app.get('/choose', function(req, res){
   res.render('pages/choose.hbs');
});

app.post('/choose', function(req, res){
    //res.render('zip of the files?');
});

app.listen(5000);
