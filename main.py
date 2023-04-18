import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

# Blood Group
dat = {
    "A+": 0,
    "A-": 0,
    "B+": 0,
    "B-": 0,
    "AB+": 0,
    "AB-": 0,
    "O+": 0,
    "O-": 0,
    "rh-null": 0,
    "others": 0,
}
disDat = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0}

df = pd.read_csv("event.csv")

for index, row in df.iterrows():
    disease_count = 0
    
    for i in range(6):
        if row[13 + i] != "nan":
            disease_count += 1
            
    disDat[disease_count] += 1
    dat[row[6]] += 1


print(df.head())

plt.bar(dat.keys(), dat.values(), width=0.9)

save_path = "D:\Study\Healthcare record management\public\images\plot1.png"
plt.savefig(save_path)
plt.close()


explodeTuple = (0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1)
lab = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "rh-null", "others"]
plt.pie(dat.values(), labels=lab, shadow=True, explode=explodeTuple, autopct="%1.2f%%")
save_path = "D:\Study\Healthcare record management\public\images\plot2.png"
plt.savefig(save_path)
plt.close()
