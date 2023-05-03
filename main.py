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
diabetes = {"1-15": 0, "16-30": 0, "31-45": 0, "46-60": 0, "60+": 0}
bmi = {}

df = pd.read_csv("event.csv")
for index, row in df.iterrows():
    disease_count = 0
    bmi[row[7]/100] = row[8]
    for i in range(6):
        if (str(row[13 + i]) != "-"):
            if (str(row[13 + i]).lower() == "diabetes"):
                for i in range(5):
                    if (15*(i+1) - row[4] < 15) and (row[4] - (15*i) < 15):
                        if i == 0:
                            diabetes["1-15"] += 1
                        elif i == 1:
                            diabetes["16-30"] += 1
                        elif i == 2:
                            diabetes["31-45"] += 1
                        elif i == 3:
                            diabetes["46-60"] += 1
                        else:
                            diabetes["60+"] += 1
            # print(row[12+i], disease_count)
            disease_count += 1
    disDat[disease_count] += 1
    dat[row[6]] += 1

# print(df.head())

plt.bar(diabetes.keys(), diabetes.values(), width=0.9)

save_path = "D:\Study\Healthcare record management\public\images\plot0.png"
plt.savefig(save_path)
plt.close()

plt.bar(dat.keys(), dat.values(), width=0.9)

save_path = "D:\Study\Healthcare record management\public\images\plot1.png"
plt.savefig(save_path)
plt.close()

plt.bar(disDat.keys(), disDat.values(), width=0.9)

save_path = "D:\Study\Healthcare record management\public\images\plot2.png"
plt.savefig(save_path)
plt.close()

explodeTuple = (0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1)
lab = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "rh-null", "others"]
plt.pie(dat.values(), labels=lab, shadow=True, explode=explodeTuple, autopct="%1.2f%%")
save_path = "D:\Study\Healthcare record management\public\images\plot3.png"
plt.savefig(save_path)
plt.close()

img = plt.imread("public/images/BMI_chart1.jpg")
fig, ax = plt.subplots()
ax.imshow(img, extent=[36, 124, 1.4314, 2.009])
ax.set_aspect('auto')
plt.xlim([36, 124])
plt.ylim([1.4314, 2.009])
plt.grid()

plt.scatter(bmi.values(), bmi.keys())
save_path = "D:\Study\Healthcare record management\public\images\plot4.png"
plt.savefig(save_path)
plt.close()

