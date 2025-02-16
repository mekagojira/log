# Read .env with air [go]

[Source](https://github.com/air-verse/air/issues/58#issuecomment-898537034)

Update .air.yaml to this to make air reading argument from .env file:

```
[build]
bin = ";export $(grep -v '^#' ..env | xargs); ./tmp/main"
cmd = "go build -o ./tmp/main ."
```
