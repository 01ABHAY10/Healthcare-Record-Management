import os
import matplotlib.pyplot as plt
import numpy as np

# Plot some data
x = []
y = []



plt.plot(x, y)

# Save the plot to a file
save_path = "D:\Study\Healthcare record management\public\images\img.png"
plt.savefig(save_path)


file = 'event.csv'
if (os.path.exists(file) and os.path.isfile(file)):
  os.remove(file)
  print("file deleted")
else:
  print("file not found")