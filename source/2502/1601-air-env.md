# Read .env with air [go]

Update .air.yaml to this to make air reading argument from .env file:

```
[build]
bin = ";export $(grep -v '^#' ..env | xargs); ./tmp/main"
cmd = "go build -o ./tmp/main ."
```
