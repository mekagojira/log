# How to sync state value with search params [react,web]

Init the value with search params like this:

```
const urlParams = new URLSearchParams(window.location.search)
const defaultQuery = urlParams.get('search') || ''
const [query, setQuery] = useState(defaultQuery)
```

Update the search params with query value like this:

```
const urlParams = new URLSearchParams()
urlParams.set('search', query)
window.history.replaceState({}, '', window.location.pathname + '?' + urlParams.toString())
```
