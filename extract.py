with open("memdump.txt", "rb") as f:
    data = f.read()

import re
matches = re.finditer(b'const CVDocumentInner', data)
for m in matches:
    start = m.start()
    # Find the start of the file or something.
    # The file has "import React" or "import { ... } from"
    chunk = data[max(0, start - 2000) : start + 90000]
    # Filter printable chars
    res = b"".join(bytes([b]) if 32 <= b < 127 or b in (9, 10) else b"" for b in chunk)
    
    with open(f"match_{start}.txt", "wb") as out:
        out.write(res)
