# Read .env with air [go]

Update .air.yaml:

```
[build]
bin = ";export $(grep -v '^#' ..env | xargs); ./tmp/main"
cmd = "go build -o ./tmp/main ."
```
