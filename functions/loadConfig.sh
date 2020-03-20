firebase functions:config:set $(jq -r 'to_entries[] | [.key, (.value | tojson)] | join("=")' < .runtimeconfig.json)
