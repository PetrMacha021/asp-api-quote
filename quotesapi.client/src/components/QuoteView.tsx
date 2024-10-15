import { Quote, useApiContext } from "../providers/ApiProvider";
import { useState } from "react";

export default function QuoteView({quote}: {quote: Quote}) {
  const context = useApiContext();

  const [selectedTag, setSelectedTag] = useState<number>(-1);

  return (
    <li key={quote.quoteId}>
      {quote.text}
      <button onClick={() => context.removeQuote(quote.quoteId.toString())}>Remove</button>
      <select defaultValue={-1} value={selectedTag} onChange={event => setSelectedTag(parseInt(event.target.value))}>
        <option value={-1} disabled></option>
        {context.tags.map(t => (
          <option key={t.id} value={t.id}>{t.text}</option>
        ))}
      </select>
      <button onClick={() => selectedTag !== null && context.addTagToQuote(quote.quoteId.toString(), selectedTag)}>Add Tag</button>
    </li>
  )
}
