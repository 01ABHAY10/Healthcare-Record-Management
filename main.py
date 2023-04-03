import sys
import json

jsonData = json.loads(sys.argv[1])

print(f'Received data: {jsonData}')
