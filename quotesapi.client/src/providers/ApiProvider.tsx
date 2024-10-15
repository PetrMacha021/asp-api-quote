import { createContext, ReactNode, useContext, useState } from "react";

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

export interface LoginData {
  tokenType: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
}

interface ApiContextType {
  randomQuote: Quote;
  quotes: Quote[];
  isLoggedIn: boolean;
  addQuote: (quote: Quote) => void;
  getRandomQuote: () => void;
  login: (username: string, password: string) => void;
  register: (username: string, password: string) => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider = ({children}: { children: ReactNode }) => {
  const [randomQuote, setRandomQuote] = useState<Quote>({ created: "", quoteId: 0, text: "", userId: "" });
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [token, setToken] = useState<LoginData>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const addQuote = (quote: Quote) => {
    setQuotes((prevQuotes) => [...prevQuotes, quote]);
  };

  const getRandomQuote = () => {
    fetch("http://localhost:5146/api/Quotes/random")
      .then((resp) => resp.json() as unknown as Quote)
      .then((data) => {
        setRandomQuote(data);
      })
      .catch(err => {
        console.error(err);
      })
  }

  const login = (username: string, password: string) => {
    fetch("http://localhost:5146/login", {
      method: "POST",
      body: JSON.stringify({
        "email": username,
        "password": password
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(async (resp) => {
      if (!resp.ok) return;
      setToken(await resp.json());
      setIsLoggedIn(true);
    }).catch(err => {
      console.error(err);
    });
  }

  const register = (username: string, password: string) => {
    fetch("http://localhost:5146/register", {
      method: "POST",
      body: JSON.stringify({
        "email": username,
        "password": password
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(resp => {
      if (!resp.ok) return;
    }).catch(err => {
      console.error(err);
    })
  }

  return (
    <ApiContext.Provider value={{ randomQuote, quotes, isLoggedIn, addQuote, getRandomQuote, login, register }}>
      {children}
    </ApiContext.Provider>
  )
};

export const useApiContext = () => {
  const context = useContext(ApiContext);
  if (!context) throw new Error('useApiContext must be used within a ApiProvider');
  return context;
}
