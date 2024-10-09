import './App.css';
import RandomQuote from "./components/RandomQuote.tsx";

export interface Quote {
  quoteId: number;
  text: string;
  created: string;
  userId: string;
}

export interface Tag {
  id: number;
  text: string;
  type: number;
}

export function App() {
  return (
    <RandomQuote />
  )
}
