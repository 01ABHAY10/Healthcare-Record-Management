
import matplotlib.pyplot as plt
import numpy as np
import csv

# Blood Group
dat = {'A+':0, 'A-':0, 'B+':0,'B-':0, 'AB+':0, 'AB-':0, 'O+':0, 'O-':0, 'rh-null':0, 'others':0}

with open("event.csv", "r") as file:
  data = csv.reader(file)
  for lines in data:
      dat[lines[6]] += 1

plt.bar(dat.keys(), dat.values(), width=0.9,autopct='%1.2f%%')

save_path = "D:\Study\Healthcare record management\public\images\plot1.png"
plt.savefig(save_path)
plt.close()
explodeTuple = (0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1)
lab = ['A+', 'A-', 'B+','B-', 'AB+', 'AB-', 'O+', 'O-', 'rh-null', 'others']
plt.pie(dat.values(), labels=lab, shadow=True, explode=explodeTuple,  autopct='%1.2f%%')
save_path = "D:\Study\Healthcare record management\public\images\plot2.png"
plt.savefig(save_path)