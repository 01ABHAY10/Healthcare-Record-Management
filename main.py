import json
import sys

# read JSON object from standard input
json_str = sys.stdin.readline()

# parse JSON string back into a Python object
json_obj = json.loads(json_str)
print(json_obj["name"])
# do something with the JSON object
response = {'status': 'success'}

# write response to standard output
sys.stdout.write(json.dumps(response))