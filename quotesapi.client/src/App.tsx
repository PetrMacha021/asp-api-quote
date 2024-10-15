import './App.css';
import RandomQuote from "./components/RandomQuote.tsx";
import Login from "./components/Login.tsx";
import {useApiContext} from "./providers/ApiProvider.tsx";

export function App() {
  const context = useApiContext();

  return (
    <div>
      <RandomQuote/>
      { !context.isLoggedIn &&
          <Login/>
      }
    </div>
  )
}
