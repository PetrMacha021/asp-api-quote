import {useApiContext} from "../providers/ApiProvider.tsx";
import {useEffect} from "react";

export default function RandomQuote() {
  const context = useApiContext();

  useEffect(() => {
    context.getRandomQuote();
  }, []);

  return (
    <div>
      <p>Random quote: {context.randomQuote.text}</p>
      <button onClick={context.getRandomQuote}>Get a different one</button>
    </div>
  )
}
