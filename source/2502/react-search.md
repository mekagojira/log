# How to sync state value with search params [react]

Init the value with search params like this:

```typescript
const urlParams = new URLSearchParams(window.location.search)
const defaultQuery = urlParams.get('searchKey') || ''
const [query, setQuery] = useState(defaultQuery)
```

Update the search params with query value like this:

```typescript
const urlParams = new URLSearchParams()
urlParams.set('searchKey', query)
window.history.replaceState({}, '', window.location.pathname + '?' + urlParams.toString())
```
