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
    // var arr = $('form').serializeArray();
    // console.log(req);
    // console.log("req "+filename);
    // console.log('val '+$('input:file').val());

    // var temp = arr[2].value;
    // var divs = arr[3].value;
    // console.log('temp '+temp);
    // console.log('divs '+divs);

    var form = new formidable.IncomingForm();
    form.parse(req);
    form.on('fileBegin',function(name, file){
        file.path ='public/MIDI_FILES/' + name;
        console.log('New file: ' + file.path);
    });
    form.on('file', function(name, file){
    	// completion(name);
        // magenta stuff - generate files
        // console.log('Running: ' + music_rnn.isInitialized())
        // var midifile = fs.readFileSync('public/MIDI_FILES/'+ name);
        // console.log('--------UPLOADED----------');  
        // var ns = core.midiToSequenceProto(midifile);
        // console.log(ns);
        // console.log('--------QUANTIZE----------');
        // var qns = core.sequences.quantizeNoteSequence(ns, 4); // allows for 4 * kth notes
        // console.log(qns);
        // music_rnn
        // .continueSequence(qns, qns.totalQuantizedSteps, 1.2) //steps/-^ quarter notes
        // .then(function(sample){
        //     console.log('--------MACHINE-----------');
        //     for (var i = 0; i < sample.notes.length; i++) {
        //         sample.notes[i].velocity = 100;
        //     }
        // 	console.log(sample);
        // 	var newmidi = core.sequenceProtoToMidi(sample);
        // 	fs.appendFileSync('public/MIDI_FILES/new/' + name, Buffer.from(newmidi));
        // 	console.log('Number Crunch Complete');     })
        // .catch(function(reason){
        // 	console.log('Something has gone terribly wrong');
        // 	console.log(reason);       });        
    });
    //combine the files to play synchronously
    // runmc(filename);
    res.render('success.hbs');//, {name: filename});
    // res.download('./public/MIDI_FILES/new/D14146541.midi')
});

app.get('/', function (req, res){
    res.render('main.hbs');
});

app.get('/choose', function(req, res){
   res.render('choose.hbs');
});


function runmc(fullfilename){
    var fname = fullfilename.split('.')[0];
    const execute = "./public/midicsv ";
    var og_midi = "public/MIDI_FILES/" + fullfilename ;
    var og_csv = " public/CSV_FILES/" + fname + ".csv" ;
    console.log('COMMAND: '+ execute + og_midi + og_csv);
    child_process.exec(execute + og_midi + og_csv, function(error, stdout, stderr){
        if (error) {
           console.error("-upload error: " + error);
           return;
        }
    });

    var ml_midi = "public/MIDI_FILES/new/" + fullfilename ;
    var ml_csv = " public/CSV_FILES/new/" + fname + ".csv" ;
    console.log('COMMAND: '+ execute + ml_midi + ml_csv);
    child_process.exec(execute + ml_midi + ml_csv, function(error, stdout, stderr){
        if (error) {
           console.error("-create error: " + error);
           return;
        }
    });

    // child_process.exec('python3 public/move_around.py ' + fname, [cwd='public'], function(error, stdout, stderr){
    //     if (error) {
    //        console.error("-move error: " + error);
    //        return;
    //     }
    // });

}

app.listen(process.env.PORT || 5000);
