import { useApiContext } from "../providers/ApiProvider";
import { useState } from "react";

export default function RemoveTag() {
  const context = useApiContext();
  const [tagId, setTagId] = useState<string>("");

  return (
    <div>
      <select defaultValue={-1} value={tagId} onChange={event => setTagId(event.target.value)}>
        <option value={-1} disabled></option>
        {context.tags.map(t => (
          <option key={t.id} value={t.id}>{t.text}</option>
        ))}
      </select>
      <button onClick={() => context.removeTag(tagId)}>Remove Tag</button>
    </div>
  )
}
