var express = require('express');
var formidable = require('formidable');
var hbs = require('hbs');
var child_process = require('child_process');
var path  = require('path');
var fs = require('fs');

const model = require('@magenta/music/node/music_rnn');
const core = require('@magenta/music/node/core');
const tf = require('@tensorflow/tfjs-node');
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
    form.parse(req);
    form.on('fileBegin',function(name, file){
        file.path ='public/MIDI_FILES/' + file.name;
        console.log('New file: ' + file.path);
    });
    form.on('file', function(name, file){
        var fname = file.name.split('.')[0];
        const execute = "public/midicsv ";
        var new_file = " public/CSV_FILES/"+ fname + ".csv" ;
        console.log('COMMAND: '+ execute + file.path + new_file);
    	child_process.exec(execute + file.path + new_file, function(error, stdout, stderr){
    	    if (error) {
    	       console.error("error: " + error);
    	       return;
            }
    	});
        // magenta stuff - generate files
        console.log('Running: ' + music_rnn.isInitialized())
        var midifile = fs.readFileSync('public/MIDI_FILES/'+file.name);
        var ns = core.midiToSequenceProto(midifile);
        var qns = core.sequences.quantizeNoteSequence(ns, 480); ///////read from notesequence or csvmidi
        console.log(qns);
        var newnotes = music_rnn.continueSequence(qns, 2400); ///////// read from totaltime ns or csvmdid
        console.log(newnotes);
        var newmidi = core.sequenceProtoToMidi('public/MIDI_FILES/new/mld-'+file.name);
    // for file in genereated folder:
        // child_process.exec('python3 public/move_around.py ' + public/MIDI_FILES/new/mld-'+file.name );
    // return files to user
    });
    // res.render('zip of the files?')
    res.render('pages/success.hbs');
});


app.get('/choose', function(req, res){
   res.render('pages/choose.hbs');
});

app.listen(5000);
