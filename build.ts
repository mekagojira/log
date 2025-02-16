import * as fs from 'fs'
import * as path from 'path'
import showdown from 'showdown'

interface Resource {
  id: string
  title: string
  content: string
  tags: string[]
  text: string
}

const converter = new showdown.Converter()
const sourceDir = './source'
const files: { fileName: string; content: string }[] = []

for (const dir of fs.readdirSync(sourceDir)) {
  const dirPath = path.join(sourceDir, dir)
  if (fs.statSync(dirPath).isDirectory()) {
    for (const file of fs.readdirSync(dirPath)) {
      if (file.endsWith('.md')) {
        files.push({
          fileName: path.join(dirPath, file),
          content: fs.readFileSync(path.join(dirPath, file), 'utf8'),
        })
      }
    }
  }
}

// delete every in log
fs.rmSync('./log', { recursive: true, force: true })
fs.mkdirSync('./log')

const resource: string[] = []

const fetched: Resource[] = []
for (const f of files) {
  const fileId = f.fileName.replace(/\.md$/, '').replaceAll('/', '-')
  const response = fs.readFileSync(f.fileName, 'utf8')
  const html = converter.makeHtml(response)
  const lines = response.split('\n')
  const firstLine = lines[0].replace(/^# */, '')

  const content = converter.makeHtml(lines.slice(1).join('\n'))

  const text = content
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const title = firstLine
  const tags = title.match(/\[(.+?)\]/)?.[1].split(',') || []

  const resource = {
    content,
    id: fileId,
    tags: tags.map(item => item.trim()),
    title: title.split('[')[0].trim(),
    text: text,
  }

  fs.writeFileSync(`./log/${fileId}.json`, JSON.stringify(resource, null, 2))
}

console.log(fetched)

fs.writeFileSync(
  `./log/resource.json`,
  JSON.stringify(
    fetched.sort((a, b) => b.id.localeCompare(a.id)),
    null,
    2
  )
)
