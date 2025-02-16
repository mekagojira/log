interface Resource {
  id: string
  title: string
  content: string
  tags: string[]
}

const codeBlock = (text: string): string => '```' + '\n' + text + '\n' + '```'

export const data: Resource[] = [
  {
    id: '250216-air-env',
    title: 'Read .env with air',
    content:
      `[Source](https://github.com/air-verse/air/issues/58#issuecomment-898537034)\n` +
      `Update .air.yaml to this to make air reading argument from .env file:\n` +
      codeBlock(
        `[build]
bin = ";export $(grep -v '^#' ..env | xargs); ./tmp/main"
cmd = "go build -o ./tmp/main ."
`
      ),
    tags: ['go'],
  },
]
