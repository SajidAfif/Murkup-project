import json

log_path = "/home/bolt/.gemini/antigravity/brain/ae966031-3e03-4c7b-bd52-c9b0458cd2ff/.system_generated/logs/overview.txt"
with open(log_path, 'r') as f:
    for line in f:
        try:
            data = json.loads(line)
        except:
            continue
        
        tc = data.get("tool_calls", [])
        for call in tc:
            if call.get("name") in ["replace_file_content", "write_to_file"]:
                args = call.get("args", {})
                content = args.get("CodeContent") or args.get("ReplacementContent")
                if content:
                    print(f"File: {args.get('TargetFile')}")
                    print(f"Content repr length: {len(repr(content))}")
                    print(f"Content starts with: {repr(content[:50])}")
                    print(f"Is string? {isinstance(content, str)}")
                    break
        else:
            continue
        break
