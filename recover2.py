with open("match_113562582.txt", "r", encoding="latin1") as f:
    data = f.read()

import re
match = re.search(r'"sourcesContent":\["(.*?)"\]', data, re.DOTALL)
if match:
    # It's a JSON string, so we need to decode the JSON string format.
    # We can just wrap it in JSON and decode
    import json
    try:
        source = json.loads('"' + match.group(1) + '"')
        with open("src/components/CVDocument.tsx", "w", encoding="utf-8") as out:
            out.write(source)
        print("Recovered! Length:", len(source))
    except Exception as e:
        print("Error decoding:", e)
else:
    print("Not found")
