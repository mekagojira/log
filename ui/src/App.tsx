import { useEffect, useState } from 'react'

const RESOURCE_ROOT = 'https://raw.githubusercontent.com/mekagojira/log/refs/heads/main/log/'
const RESOURCE_LINK = RESOURCE_ROOT + 'resource.json'

interface Resource {
  id: string
  title: string
  content: string
  tags: string[]
}

function App() {
  const [resources, setResources] = useState<Resource[]>([])

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
        const text = (await response.json()) as Resource
        fetched.push({
          title: text?.title || '',
          content: text?.content || '',
          tags: Array.isArray(text?.tags) ? text.tags : [],
        })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setResources(fetched)
    }
  }

  console.log(resources)

  return (
    <div className="container mx-auto px-4 py-8 text-md md:text-md font-display min-h-screen bg-dracula-bg text-dracula-fg">
      <input className="px-3 py-4 w-full bg-dracula-purple shadow-lg border-3 border-dracula-purple rounded-lg" placeholder="Search" />
      <div className="pt-4" />
      <div className="w-full p-4 bg-dracula-bg shadow-xl rounded-lg border-2 border-dracula-purple">
        <div className="text-dracula-green">asdhsadksahdkajs</div>
        <div className="text-dracula-comment text-md md:text-md">asdajsdhksadhjsakdjdjkdhdkhjasd</div>
        <div className="pt-2" />
        <button className="px-3 py-1 bg-dracula-yellow text-dracula-bg rounded-lg shadow-lg">Read All</button>
      </div>
    </div>
  )
}

export default App
