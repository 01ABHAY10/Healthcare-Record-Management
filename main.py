
from numpy import *
import json
from matplotlib import pyplot as plt

with open('package.json','r') as file:
    data = json.load(file)
    for i in data:
        print(i,": ",data[i])



frequency = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0}

def collatz_conjecture(num):
    global frequency
    for i in range(1, num + 1):
        frequency[int(str(i)[0])] += 1
        while i > 1:
            if i % 2 == 0:
                i /= 2
                frequency[int(str(i)[0])] += 1
                # print(int(i))
            else:
                i = 3 * i + 1
                frequency[int(str(i)[0])] += 1
                # print(int(i))
    return frequency


collatz_conjecture(10000)

plt.plot(frequency.keys(), frequency.values())
plt
display(plt, target="graph")
plt.show()
