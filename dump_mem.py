import re
import sys
import os

pid = 39

try:
    with open(f"/proc/{pid}/maps", "r") as f:
        maps = f.readlines()
except:
    print("Cannot read maps")
    sys.exit(1)

mem_file = open(f"/proc/{pid}/mem", "rb")
out_file = open("memdump.txt", "wb")

for line in maps:
    parts = line.split()
    if not parts:
        continue
    perms = parts[1]
    # We want readable segments, usually rw-p or r--p
    if "r" not in perms:
        continue
    
    addr_range = parts[0]
    start, end = [int(x, 16) for x in addr_range.split("-")]
    
    try:
        mem_file.seek(start)
        chunk = mem_file.read(end - start)
        out_file.write(chunk)
    except Exception as e:
        pass

mem_file.close()
out_file.close()
print("Dumped")
