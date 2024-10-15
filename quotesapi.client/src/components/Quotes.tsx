import { useApiContext } from "../providers/ApiProvider";
import { useEffect } from "react";

export default function Quotes() {
  const context = useApiContext();

  useEffect(() => {
    context.getQuotes();
  }, []);

  return (
    <div>
      <input type="text" placeholder="Search" onChange={event => context.setSearch(event.target.value)} />
      <select defaultValue={-1} value={context.searchTag} onChange={event => context.setSearchTag(parseInt(event.target.value))}>
        <option value={-1}>All</option>
        {context.tags.map(t => (
          <option key={t.id} value={t.id}>{t.text}</option>
        ))}
      </select>
      <button onClick={context.getQuotes}>Refresh quotes</button>
      <ul>
        {context.quotes.map(q => (
          <li key={q.quoteId}>
            {q.text}
            <button onClick={() => context.removeQuote(q.quoteId.toString())}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
