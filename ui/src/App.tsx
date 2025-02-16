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
}

showdown.setFlavor('github')

function App() {
  const converter = new showdown.Converter()
  const [query, setQuery] = useState('')
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
        const response = await fetch(RESOURCE_ROOT + resource)
        const resourceList = (await response.json()) as Resource[]
        resourceList.forEach(r =>
          fetched.push({
            ...r,
            content: converter.makeHtml(r.content),
          })
        )
      }
    } catch (e) {
      console.error(e)
    } finally {
      setResources({ list: fetched, searcher: new FuzzySearch(fetched, ['title', 'content'], { caseSensitive: false }) })
    }
  }

  const search = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setQuery(query)
  }

  return (
    <main className="min-h-screen bg-dracula-bg text-dracula-fg">
      <div className="container mx-auto px-4 py-8 text-md md:text-md font-display">
        <input className="px-3 py-4 w-full bg-dracula-purple shadow-lg border-3 border-dracula-purple rounded-lg" placeholder="Search" onChange={search} />
        {resources.searcher.search(query).map(resource => {
          return (
            <div className="w-full p-4 bg-dracula-bg shadow-xl rounded-lg border-2 border-dracula-purple overflow-hidden mt-4 hover:shadow-xl" key={resource.id}>
              <div className="text-dracula-green font-bold text-xl border-b border-dracula-green pb-2">{resource.id}</div>
              <div className="flex text-white text-md md:text-md pt-4">
                <div id="content" className="w-full" dangerouslySetInnerHTML={{ __html: resource.content }} />
              </div>
              <div className="pt-2" />
              <div className="flex flex-wrap">
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
