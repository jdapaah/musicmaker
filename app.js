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
    	// child_process.exec(execute + file.path + new_file, function(error, stdout, stderr){
    	//     if (error) {
    	//        console.error("error: " + error);
    	//        return;
     //        }
    	// });
        // magenta stuff - generate files
        console.log('Running: ' + music_rnn.isInitialized())
        var midifile = fs.readFileSync('public/MIDI_FILES/'+file.name);
        console.log('--------UPLOADED----------');  
        var ns = core.midiToSequenceProto(midifile);
        console.log(ns);
        console.log('--------QUANTIZE----------');
        var qns = core.sequences.quantizeNoteSequence(ns, 1); // allows for 2^(k+1)th notes
        console.log(qns);
        music_rnn
        .continueSequence(qns, qns.totalQuantizedSteps, 1.0) //steps/-^ quarter notes
        .then(function(sample){
            console.log('--------MACHINE-----------');
            for (var i = sample.notes.length - 1; i >= 0; i--) {
                sample.notes[i].velocity = 120;
            }
        	console.log(sample);
        	var newmidi = core.sequenceProtoToMidi(sample);
        	fs.appendFileSync('public/MIDI_FILES/new/'+file.name, Buffer.from(newmidi));
        	console.log('Number Crunch Complete');     })
        .catch(function(reason){
        	console.log('Something has gone terribly wrong');
        	console.log(reason);       });
        
        // child_process.exec('python3 public/move_around.py ' + public/MIDI_FILES/new/mld-'+file.name );
    });
    // res.render('zip of the files?')
    res.render('templates/success.hbs');
});

app.get('/', function (req, res){
    res.render('templates/main.hbs');
});

app.get('/choose', function(req, res){
   res.render('templates/choose.hbs');
});

app.listen(5000);
