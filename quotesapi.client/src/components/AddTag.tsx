import { useState } from "react";
import { useApiContext } from "../providers/ApiProvider";

export default function AddTag() {
  const [text, setText] = useState("");
  const context = useApiContext();

  return (
    <div>
      <label htmlFor="tag">Tag text:</label>
      <input id="tag" type="text" value={text} onChange={event => setText(event.target.value)} placeholder="Text"/>
      <button type="submit" onClick={() => {
        context.addTag(text);
      }}>Add Tag</button>
    </div>
  )
}
