import { createContext, ReactNode, useContext, useEffect, useState } from "react";

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
  tags: Tag[];
  searchTag: number;
  isLoggedIn: boolean;
  addQuote: (text: string) => void;
  addTag: (text: string) => void;
  getRandomQuote: () => void;
  getQuotes: () => void;
  getTags: () => void;
  removeQuote: (id: string) => void;
  login: (username: string, password: string) => void;
  register: (username: string, password: string) => void;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setSearchTag: React.Dispatch<React.SetStateAction<number>>
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const [randomQuote, setRandomQuote] = useState<Quote>({ created: "", quoteId: 0, text: "", userId: "" });
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [token, setToken] = useState<LoginData>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [search, setSearch] = useState("");
  const [searchTag, setSearchTag] = useState(-1);

  useEffect(() => {
    getTags();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    getQuotes();
  }, [search, searchTag]);

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
        "password": password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
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
        "password": password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(resp => {
      if (!resp.ok) return;
    }).catch(err => {
      console.error(err);
    })
  }

  const getQuotes = () => {
    if (!token) throw new Error("Not logged in");
    let url = "http://localhost:5146/api/Quotes/me";

    if (search || searchTag != -1) url += "?";
    if (search) url += `text=${search}`;
    if (search && searchTag != -1) url += `&tag=${searchTag}`;
    if (searchTag != -1) url += `tag=${searchTag}`;

    fetch(url, {
      headers: {
        "Authorization": `${token.tokenType} ${token.accessToken}`,
      },
    }).then(async (resp) => {
      if (!resp.ok) throw new Error(await resp.text());
      return await resp.json() as unknown as Quote[]
    })
      .then(resp => {
        setQuotes(resp)
      })
      .catch(err => console.error(err));
  }

  const getTags = () => {
    fetch("http://localhost:5146/api/VTags")
      .then(async (resp) => {
        if (!resp.ok) throw new Error(await resp.text());
        return await resp.json() as unknown as Tag[]
      })
      .then(resp => setTags(resp))
      .catch(err => console.error(err));
  }

  const removeQuote = (id: string) => {
    if (!token) throw new Error("Not logged in");
    fetch(`http://localhost:5146/api/Quotes/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `${token.tokenType} ${token.accessToken}`,
      },
    }).then(async resp => {
      if (!resp.ok) throw new Error(await resp.text());
      setQuotes((prevQuotes) => prevQuotes.filter(q => q.quoteId.toString() !== id));
    }).catch(err => {
      throw new Error(err);
    });
  }

  const addQuote = (text: string) => {
    if (!token) throw new Error("Not logged in");
    let quote: Quote = {
      created: "", quoteId: 0, userId: "",
      text: text,
    }

    fetch("http://localhost:5146/api/Quotes", {
      method: "POST",
      body: JSON.stringify(quote),
      headers: {
        "Authorization": `${token.tokenType} ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    }).then(async (resp) => {
      if (!resp.ok) throw new Error(await resp.text());
      quote = await resp.json() as unknown as Quote;
      setQuotes((prevQuotes) => [...prevQuotes, quote]);
    }).catch(err => {
      throw new Error(err);
    })
  };

  const addTag = (text: string) => {
    if (!token) throw new Error("Not logged in");
    const tag: Tag = {
      id: 0, type: 0,
      text: text,
    }

    fetch("http://localhost:5146/api/VTags", {
      method: "POST",
      body: JSON.stringify(tag),
      headers: {
        "Authorization": `${token.tokenType} ${token.accessToken}`,
      },
    }).then(async (resp) => {
      if (!resp.ok) throw new Error(await resp.text());
    }).catch(err => {
      console.error(err);
    });
  }

  return (
    <ApiContext.Provider
      value={{
        randomQuote,
        quotes,
        tags,
        searchTag,
        isLoggedIn,
        addQuote,
        addTag,
        getRandomQuote,
        getQuotes,
        getTags,
        removeQuote,
        login,
        register,
        setSearch,
        setSearchTag,
      }}>
      {children}
    </ApiContext.Provider>
  )
}

export const useApiContext = () => {
  const context = useContext(ApiContext);
  if (!context) throw new Error('useApiContext must be used within a ApiProvider');
  return context;
}
