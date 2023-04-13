# import os
# import json
# import sys
# import csv

# # read JSON object from standard input
# json_str = sys.stdin.readline()

# # parse JSON string back into a Python object
# json_obj = json.loads(json_str)

# data = []

# for i in json_obj:
#     data.append(json_obj[i])

# with open('event.csv', 'a') as f_object:
#     writer_object = csv.writer(f_object)
#     writer_object.writerow(data)
#     f_object.close()

# # file = 'event.csv'
# # if (os.path.exists(file) and os.path.isfile(file)):
# #   os.remove(file)
# #   print("file deleted")
# # else:
# #   print("file not found")

# # do something with the JSON object
# response = {'status': 'success'}

# # write response to standard output
# sys.stdout.write(json.dumps(response))


import matplotlib.pyplot as plt

# Plot some data
x = [1, 2, 3, 4]
y = [10, 20, 15, 25]
plt.plot(x, y)

# Save the plot to a file
save_path = "D:\Study\Healthcare record management\public\images\img.png"
plt.savefig(save_path)
print(1)