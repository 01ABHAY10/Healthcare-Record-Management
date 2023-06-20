
import json
import csv
import sys

json_objs = []
for line in sys.stdin:
    json_objs.append(json.loads(line))
    
with open('event.csv', 'a', newline="") as f_object:
    writer_object = csv.writer(f_object)
    for json_obj in json_objs:
        data = []
        for i in json_obj:
            data.append(json_obj[i])
        writer_object.writerow(data)

response = {'status': 'success'}
sys.stdout.write(json.dumps(response))