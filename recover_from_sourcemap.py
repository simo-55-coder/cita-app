import json
import re

with open("match_113562582.txt", "r") as f:
    data = f.read()

# The match text might have HTTP headers and transpiled code.
# The sourcemap is at the end or embedded as base64?
# Wait, Vite serves sourcemaps as base64 data URIs sometimes, or just raw JSON if we intercept the map file.
# But looking at the match, it has `"sourcesContent":["import React from 'react';\n..."]`
# So it's raw JSON! Let's extract the JSON object.

start = data.find('{"version":3,')
if start != -1:
    end = data.rfind('}') + 1
    json_str = data[start:end]
    try:
        obj = json.loads(json_str)
        source = obj.get("sourcesContent", [])[0]
        with open("recovered_CVDocument.tsx", "w") as out:
            out.write(source)
        print("Success! Recovered length:", len(source))
    except Exception as e:
        print("Failed to parse JSON:", e)
else:
    print("Could not find sourcemap JSON")
