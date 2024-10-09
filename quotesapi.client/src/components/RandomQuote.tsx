import {useEffect, useState} from "react";
import {Quote} from "../App";

export default function RandomQuote() {
  const [quote, setQuote] = useState("Loading...");

  useEffect(() => {
    fetch("http://localhost:5146/api/Quotes/random")
      .then((resp) => resp.json() as unknown as Quote)
      .then((data) => {
        setQuote(data.text);
      })
      .catch(err => {
        console.error(err);
        setQuote("Error");
      })
      }, []);

    return (
      <p>Random quote: {quote}</p>
    )
  }
