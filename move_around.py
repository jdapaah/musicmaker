from sys import argv
import csv
import os


def main(primer):
    # get length of primer
        # run midicsv on primer midi
    # make that the length of generated melody
        # with primer midi
    # run magenta k times
        # k is arg for magenta, as well as length
    # move_around all k magenta files
        # midicsv on all magenta files and -^ its primer
        # discard original when done moving
    # possibly zip midis together and return

    num_measures = get_measures(primer)

    # move new notes to simultaneous to primer
    for fname in os.listdir('Gen_MIDI/'+midi_prime):
        with open(fname, newline='') as read_file, open('Shifted_MIDI/%s_shifted.csv' % fname[:fname.index('.')], 'w', newline='') as write_file:
            reader = csv.reader(read_file)
            writer = csv.writer(write_file)
            for line in reader:
                track = int(line[0])
                time = int(line[1])
                if line[2] == ' Header':
                    new_ppqn = line[5]
                    endtime = num_measures * 2 * int(new_ppqn)
                    writer.writerow(line[:3] + [' 1', ' 3', str(new_ppqn)])
                    print('Header')
                elif time < endtime:
                    writer.writerow(line)
                elif time == endtime and (line[2] == ' Note_off_c' or int(line[5]) == 0):  # should only occur once
                    writer.writerow(line)
                    writer.writerow([str(track), ' '+str(endtime), ' End_track'])
                    new_track = track + 1
                    writer.writerow([str(new_track), ' 0', ' Start_track'])
                    print('New track')
                else:
                    writer.writerow([str(new_track), " " + str(time - endtime)] + line[2:])
        


def get_measures(midi_prime):
    with open('CSV_FILES/'+midi_prime+'.csv', newline='') as og_read:
        reader = csv.reader(og_read)
        for line in reader:
            if line[2] == ' Header':
                og_ppqn = int(line[5])
            if line[2] == ' End_track':
                og_length = int(line[1])

    return og_length // (og_ppqn * 2)


if __name__ == '__main__':
    if len(argv) > 1:
        main(argv[1]);
    else:
        main('D14146541');
