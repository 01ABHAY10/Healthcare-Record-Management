import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
import numpy as np
from matplotlib.ticker import MaxNLocator

# ? Covid

covid = [0, 0, 0, 0]
noCovid = [0, 0, 0, 0]


# ? Blood Group

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

# ? Cancer

ntox = [0, 0]
tox = [0, 0]


# ? Number of Diseases

disDat = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0}


# ? Diabetes

diabetes = {"1-15": 0, "16-30": 0, "31-45": 0, "46-60": 0, "60+": 0}


# ? Body-Mass Index

bmi_male = {}
bmi_female = {}


# ? Chronic-Acute Diseases

chronic = [
    "heart disease",
    "stroke",
    "lung cancer",
    "colorectal cancer",
    "depression",
    "type 2 diabetes",
    "type 1 diabetes",
    "diabetes",
    "arthritis",
    "osteoporosis",
    "asthma",
    "chronic obstructive pulmonary disease",
    "copd",
    "chronic kidney disease",
    "ckd",
    "oral disease",
]

chronicDis = []

df = pd.read_csv("event.csv")
for index, row in df.iterrows():
    if row[5].lower() == "male":
        bmi_male[row[7] / 100] = row[8]
    else:
        bmi_female[row[7] / 100] = row[8]
    chronicDis.append(0)
    if (
        "cancer" in str(row[13]).lower()
        or "cancer" in str(row[14]).lower()
        or "cancer" in str(row[15]).lower()
        or "cancer" in str(row[16]).lower()
        or "cancer" in str(row[17]).lower()
        or "cancer" in str(row[13]).lower()
    ):
        if str(row[9]) == "No" and str(row[10]) == "No" and str(row[11]) == "No":
            ntox[1] += 1
        else:
            tox[1] += 1
    else:
        if str(row[9]) == "No" and str(row[10]) == "No" and str(row[11]) == "No":
            ntox[0] += 1
        else:
            tox[0] += 1
    if (
        "covid" in str(row[12]).lower()
        or "covid" in str(row[13]).lower()
        or "covid" in str(row[14]).lower()
        or "covid" in str(row[15]).lower()
        or "covid" in str(row[16]).lower()
        or "covid" in str(row[17]).lower()
    ):
        if str(row[18]) == "No Dosage":
            covid[0] += 1
        elif str(row[18]) == "First Dose":
            covid[1] += 1
        elif str(row[18]) == "Second Dose":
            covid[2] += 1
        elif str(row[18]) == "Booster Dose":
            covid[3] += 1
    else:
        if str(row[18]) == "No Dosage":
            noCovid[0] += 1
        elif str(row[18]) == "First Dose":
            noCovid[1] += 1
        elif str(row[18]) == "Second Dose":
            noCovid[2] += 1
        elif str(row[18]) == "Booster Dose":
            noCovid[3] += 1
    disease_count = 0
    for i in range(6):
        if str(row[12 + i]) != "-":
            disease_count += 1
            if str(row[13 + i]).lower() in chronic:
                chronicDis[-1] = chronicDis[-1] or 1
            if ( "diabetes" in str(row[13 + i]).lower()):
                for i in range(5):
                    if (15 * (i + 1) - row[4] < 15) and (row[4] - (15 * i) < 15):
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
    disDat[disease_count] += 1
    dat[row[6]] += 1
plt.rcParams["figure.dpi"] = 360
ax = plt.subplot()
plt.bar(diabetes.keys(), diabetes.values(), width=0.8)
sns.despine(left=True)
sns.set(style="whitegrid")
ax.yaxis.set_major_locator(MaxNLocator(integer=True))
ax.yaxis.grid(True, linestyle="-", which="major", color="grey", alpha=0.5)
plt.xlabel("Age Group")
plt.ylabel("Number of People")
save_path = "D:\Study\Healthcare record management\public\images\plot0.png"
plt.savefig(save_path)
plt.close()

ax = plt.subplot()
width = 0.2
x = np.arange(2)
plt.bar(x - 0.1, ntox, width, color="orange")
plt.bar(x + 0.1, tox, width, color="green")
plt.xticks(x, ["People without Cancer", "People with Cancer"])
plt.ylabel("Number of people")
plt.legend(["don't drink or consume tobacco in any form", "drink or consume tobacco in any form"])
plt.grid(False)
sns.despine(left=True)
ax.yaxis.set_major_locator(MaxNLocator(integer=True))
ax.yaxis.grid(True, linestyle="-", which="major", color="grey", alpha=0.5)
# plt.rcParams['figure.dpi'] = 360
save_path = "D:\Study\Healthcare record management\public\images\plot1.png"
plt.savefig(save_path)
plt.close()

ax = plt.subplot()
plt.bar(disDat.keys(), disDat.values(), width=0.8)
plt.grid(False)
sns.despine(left=True)
ax.yaxis.set_major_locator(MaxNLocator(integer=True))
ax.yaxis.grid(True, linestyle="-", which="major", color="grey", alpha=0.5)
# plt.rcParams['figure.dpi'] = 360
plt.xlabel("Number of Diseases")
plt.ylabel("Number of People")
save_path = "D:\Study\Healthcare record management\public\images\plot2.png"
plt.savefig(save_path)
plt.close()

explodeTuple = (0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02)
lab = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "rh-null", "others"]
# plt.rcParams['figure.dpi'] = 360
plt.pie(dat.values(), labels=lab, shadow=False,
        explode=explodeTuple, autopct="%1.2f%%")
save_path = "D:\Study\Healthcare record management\public\images\plot3.png"
plt.savefig(save_path)
plt.close()

img = plt.imread("public/images/BMI_chart1.jpg")
fig, ax = plt.subplots()
ax.imshow(img, extent=[36, 124, 1.4314, 2.009])
ax.set_aspect("auto")
plt.xlim([36, 124])
plt.ylim([1.4314, 2.009])
plt.grid(False)
sns.despine(left=True)
# plt.rcParams['figure.dpi'] = 360
plt.scatter(bmi_male.values(), bmi_male.keys(), s=2.5, color="blue")
plt.scatter(bmi_female.values(), bmi_female.keys(), s=2.5, color="crimson")
plt.xlabel("Weight (kg)")
plt.ylabel("Height (m)")
save_path = "D:\Study\Healthcare record management\public\images\plot4.png"
plt.savefig(save_path)
plt.close()


chronicCount = 0
for i in chronicDis:
    if i:
        chronicCount += 1
acu = 0
for i in disDat.values():
    acu += i
acu -= chronicCount
chroAcu = {"chronic": chronicCount, "acute": acu}
lab = chroAcu.keys()
explodeTuple = (0.02, 0.02)
plt.pie(
    chroAcu.values(), labels=lab, shadow=False, explode=explodeTuple, autopct="%1.2f%%"
)
save_path = "D:\Study\Healthcare record management\public\images\plot5.png"
plt.savefig(save_path)
plt.close()

ax = plt.subplot()
width = 0.2
x = np.arange(4)
plt.bar(x - 0.1, covid, width, color="dodgerblue")
plt.bar(x + 0.1, noCovid, width, color="lightPink")
plt.xticks(x, ["no dose", "first dose", "second dose", "booster dose"])
plt.ylabel("Number of people")
plt.legend(["suffering from covid", "not suffering from covid"])
plt.grid(False)
sns.despine(left=True)
ax.yaxis.set_major_locator(MaxNLocator(integer=True))
ax.yaxis.grid(True, linestyle="-", which="major", color="grey", alpha=0.5)
# plt.rcParams['figure.dpi'] = 360
save_path = "D:\Study\Healthcare record management\public\images\plot6.png"
plt.savefig(save_path)
plt.close()
