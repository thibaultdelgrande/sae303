#codename: utf-8

import csv
import json



def csv2json(csvfile):
    with open(csvfile, 'r') as f:
        reader = csv.DictReader(f, delimiter=';')
        rows = list(reader)
        jsonfile = csvfile.replace('.csv', '.json')
        with open(jsonfile, 'w') as f:
            json.dump(rows, f, indent=4)
        print('Converted {} to {}'.format(csvfile, jsonfile))
        

if __name__ == '__main__':
    csv2json("data/france.csv")