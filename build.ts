import * as fs from 'fs'
import * as path from 'path'

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

for (const f of files) {
  const fileId = f.fileName.replace(/\.md$/, '').replaceAll('/', '-')
  console.log(fileId)
  resource.push(fileId)
  fs.writeFileSync(`./log/${fileId}`, f.content)
}

fs.writeFileSync(
  `./log/resource.json`,
  JSON.stringify(
    resource.sort((a, b) => b.localeCompare(a)),
    null,
    2
  )
)
