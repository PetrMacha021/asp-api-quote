import { useApiContext } from "../providers/ApiProvider";
import { useEffect } from "react";

export default function Quotes() {
  const context = useApiContext();

  useEffect(() => {
    context.getQuotes();
  }, []);

  return (
    <div>
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
