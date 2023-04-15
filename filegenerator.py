
import json
import csv
import sys

# read JSON objects from standard input
json_objs = []
for line in sys.stdin:
    json_objs.append(json.loads(line))

# append data from each JSON object to CSV file
with open('event.csv', 'a') as f_object:
    writer_object = csv.writer(f_object)
    for json_obj in json_objs:
        data = []
        for i in json_obj:
            data.append(json_obj[i])
        writer_object.writerow(data)

# send success response to Node.js
response = {'status': 'success'}
sys.stdout.write(json.dumps(response))