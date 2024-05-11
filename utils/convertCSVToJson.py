# const csvFilePath = 'proofs_0xcba72fb67462937b6fa3a41e7bbad36cf169815ea7fe65f8a4b85fd8f5facb28.csv';

import csv
import json
import pandas as pd

# File paths
input_csv_file = 'proofs_0xcba72fb67462937b6fa3a41e7bbad36cf169815ea7fe65f8a4b85fd8f5facb28.csv'
output_json_file = 'proofs_0xcba72fb67462937b6fa3a41e7bbad36cf169815ea7fe65f8a4b85fd8f5facb28.json'

def custom_csv_parser(input_file):
    """ Custom CSV parser to handle complex fields containing JSON arrays with commas. """
    data = []
    with open(input_file, 'r', encoding='utf-8') as file:
        next(file)  # Skip the header
        for line in file:
            # Split once on the first two commas to isolate the first two fields and the JSON array
            parts = line.strip().split(',"', 2)
            token_id = int(parts[0].replace('"', ''))
            value = int(parts[1].replace('"', ''))
            # The last part is the JSON string, remove the leading and trailing characters
            proof_string = parts[2].strip()[1:-2]  # Strip the outer "[" and "]" and extra quotes
            # Convert the string back to a list
            proof = json.loads('[' + proof_string + ']')
            
            data.append({'tokenId': token_id, 'value': value, 'proof': proof})
    return data

def save_to_json(data, output_file):
    """ Save the parsed data to a JSON file. """
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4)

data = custom_csv_parser(input_csv_file)
save_to_json(data, output_json_file)