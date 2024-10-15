import './App.css';
import Login from "./components/Login.tsx";
import {useApiContext} from "./providers/ApiProvider.tsx";
import Register from "./components/Register.tsx";
import RandomQuote from "./components/RandomQuote.tsx";

export function App() {
  const context = useApiContext();

  return (
    <div>
      <RandomQuote/>
      {!context.isLoggedIn &&
          <div>
              <Login/>
              <Register/>
          </div>
      }
    </div>
  )
}
