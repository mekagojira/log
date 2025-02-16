interface Resource {
  id: string
  title: string
  content: string
  tags: string[]
}

const br = '\n'
const codeBlock = (text: string): string => '```' + br + text + br + '```'

export const data: Resource[] = [
  {
    id: '250216-air-env',
    title: 'Read .env with air',
    content:
      `[Source](https://github.com/air-verse/air/issues/58#issuecomment-898537034)` +
      br +
      `Update .air.yaml to this to make air reading argument from .env file:` +
      br +
      codeBlock(
        `[build]
bin = ";export $(grep -v '^#' ..env | xargs); ./tmp/main"
cmd = "go build -o ./tmp/main ."
`
      ),
    tags: ['go'],
  },
  {
    id: '250216-react-search',
    title: 'How to sync state value with search params',
    content:
      'Init the value with search params like this' +
      br +
      codeBlock(`
const urlParams = new URLSearchParams(window.location.search)
const defaultQuery = urlParams.get('searchKey') || ''
const [query, setQuery] = useState(defaultQuery)`) +
      br +
      'Update the search params with query value like this' +
      br +
      codeBlock(`
const urlParams = new URLSearchParams()
urlParams.set('searchKey', query)
window.history.replaceState({}, '', window.location.pathname + '?' + urlParams.toString())
`),
    tags: ['react'],
  },
]
