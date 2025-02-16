import React, { useEffect, useState } from 'react'
import showdown from 'showdown'
import FuzzySearch from 'fuzzy-search'

const RESOURCE_ROOT = 'https://raw.githubusercontent.com/mekagojira/log/refs/heads/main/log/'
const RESOURCE_LINK = RESOURCE_ROOT + 'resource.json'

interface Resource {
  id: string
  title: string
  content: string
  tags: string[]
  text: string
}

showdown.setFlavor('github')

function App() {
  const converter = new showdown.Converter()
  const urlParams = new URLSearchParams(window.location.search)
  const defaultQuery = urlParams.get('s') || ''
  const [query, setQuery] = useState(defaultQuery)
  const [resources, setResources] = useState<{ list: Resource[]; searcher: FuzzySearch<Resource> }>({ list: [], searcher: new FuzzySearch([]) })

  useEffect(() => {
    fetchResource()
  }, [])

  const fetchResource = async () => {
    const fetched: Resource[] = []
    try {
      const response = await fetch(RESOURCE_LINK)
      const data = await response.json()
      for await (const resource of data) {
        const response = await (await fetch(RESOURCE_ROOT + resource)).text()
        const text = response
        const lines = response.split('\n')
        const firstLine = lines[0].replace(/^# */, '')

        const content = converter.makeHtml(lines.slice(1).join('\n'))
        const title = firstLine
        const tags = title.match(/\[(.+?)\]/)?.[1].split(',') || []

        fetched.push({
          content,
          id: resource,
          tags: tags.map(item => item.trim()),
          title: title.split('[')[0].trim(),
          text: text,
        })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setResources({ list: fetched, searcher: new FuzzySearch(fetched, ['title', 'text'], { caseSensitive: false }) })
    }
  }

  const search = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setQuery(query)
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('s', query)
    window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`)
  }

  return (
    <main className="min-h-screen bg-dracula-bg text-dracula-fg">
      <div className="container mx-auto px-4 py-8 text-md md:text-md font-display">
        <input className="px-3 py-4 w-full bg-dracula-purple shadow-lg border-3 border-dracula-purple rounded-lg" placeholder="Search" value={query} onChange={search} autoFocus />
        {resources.searcher.search(query).map(resource => {
          return (
            <div className="w-full p-4 bg-dracula-bg shadow-xl rounded-lg border-2 border-dracula-purple overflow-hidden mt-4 hover:shadow-xl" key={resource.id}>
              <div className="text-dracula-green font-bold text-xl border-b border-dracula-green pb-2">{resource.title}</div>
              <div className="flex text-white text-md md:text-md pt-4">
                <div id="content" className="w-full" dangerouslySetInnerHTML={{ __html: resource.content }} />
              </div>
              <div className="pt-2" />
              <div className="flex flex-wrap space-x-2">
                {resource.tags.map((tag, i) => (
                  <div key={resource.id + '.' + i} className="px-3 py-1 shadow-xl bg-dracula-purple rounded-md">
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}

export default App
