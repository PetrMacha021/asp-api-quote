import { useApiContext } from "../providers/ApiProvider";
import { useState } from "react";

export default function AddQuotes() {
  const [text, setText] = useState("");
  const context = useApiContext();

  return (
    <div>
      <label htmlFor="label">Quote text:</label>
      <input id="label" type="text" value={text} onChange={event => setText(event.target.value)} placeholder="Text"/>
      <button type="submit" onClick={() => {
        context.addQuote(text);
      }}>Add Quote</button>
    </div>
  )
}
