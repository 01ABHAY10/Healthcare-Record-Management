import json
import csv
import sys

# # read JSON object from standard input
json_str = sys.stdin.readline()

# # parse JSON string back into a Python object
json_obj = json.loads(json_str)

data = []

for i in json_obj:
    data.append(json_obj[i])

with open('event.csv', 'a') as f_object:
    writer_object = csv.writer(f_object)
    writer_object.writerow(data)
    f_object.close()

# # do something with the JSON object
response = {'status': 'success'}

# # write response to standard output
sys.stdout.write(json.dumps(response))