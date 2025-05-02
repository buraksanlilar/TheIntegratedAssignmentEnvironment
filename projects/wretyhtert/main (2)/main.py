import sys

args = sys.argv[1:]
if not args:
    sys.exit()

arr = list(map(int, args))

# Bubble Sort
n = len(arr)
for i in range(n - 1):
    for j in range(n - 1 - i):
        if arr[j] > arr[j + 1]:
            arr[j], arr[j + 1] = arr[j + 1], arr[j]

print(" ".join(map(str, arr)), end="")

