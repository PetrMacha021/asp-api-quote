import './App.css';
import {useApiContext} from "./providers/ApiProvider.tsx";
import RandomQuote from "./components/RandomQuote.tsx";
import Quotes from "./components/Quotes.tsx";
import AddQuotes from "./components/AddQuotes.tsx";
import Login from "./components/Login.tsx";
import Register from "./components/Register.tsx";
import AddTag from "./components/AddTag.tsx";

export function App() {
  const context = useApiContext();

  return (
    <div>
      <RandomQuote/>
      {context.isLoggedIn ?
        <div>
          <AddQuotes/>
          <AddTag />
          <Quotes/>
        </div>
        :
        <div>
          <Login/>
          <Register/>
        </div>
      }
    </div>
  )
}
