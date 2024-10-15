import './App.css';
import Login from "./components/Login.tsx";
import {useApiContext} from "./providers/ApiProvider.tsx";
import Register from "./components/Register.tsx";
import RandomQuote from "./components/RandomQuote.tsx";
import Quotes from "./components/Quotes.tsx";

export function App() {
  const context = useApiContext();

  return (
    <div>
      <RandomQuote/>
      {context.isLoggedIn ?
        <Quotes/>
        :
        <div>
          <Login/>
          <Register/>
        </div>
      }
    </div>
  )
}
