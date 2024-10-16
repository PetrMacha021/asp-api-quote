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
  error: string;
  success: string;
  searchTag: number;
  isLoggedIn: boolean;
  addQuote: (text: string) => void;
  addTag: (text: string) => void;
  addTagToQuote: (quoteId: string, tagId: number) => void;
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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getTags();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    getQuotes();
  }, [search, searchTag]);

  const getRandomQuote = () => {
    setError("");
    setSuccess("");
    fetch("http://localhost:5146/api/Quotes/random")
      .then(async (resp) => {
        if (!resp.ok) {
          const err = await resp.json();
          setError(err.title);
          return;
        }
        setRandomQuote(await resp.json() as unknown as Quote);
      })
      .catch(err => {
        console.error(err);
        setError(err.title);
      })
  }

  const login = (username: string, password: string) => {
    setError("");
    setSuccess("");
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
      if (!resp.ok) {
        const err = await resp.json();
        setError(err.title);
        return;
      }
      setToken(await resp.json());
      setIsLoggedIn(true);
    }).catch(err => {
      console.error(err);
      setError(err.title);
    });
  }

  const register = (username: string, password: string) => {
    setError("");
    setSuccess("");
    fetch("http://localhost:5146/register", {
      method: "POST",
      body: JSON.stringify({
        "email": username,
        "password": password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async resp => {
      if (!resp.ok) {
        const err = await resp.json();
        console.error(err.title);
        setError(err.title);
        return;
      }
    }).catch(err => {
      console.error(err);
      setError(err.title);
    })
  }

  const getQuotes = () => {
    setError("");
    setSuccess("");
    if (!token) {
      setError("Not logged in");
      return;
    }
    let url = "http://localhost:5146/api/Quotes/me";

    if (search || searchTag != -1) url += "?";

    if (search) url += `text=${search}`;

    if (search && searchTag != -1) url += `&tag=${searchTag}`;
    else if (searchTag != -1) url += `tag=${searchTag}`;

    fetch(url, {
      headers: {
        "Authorization": `${token.tokenType} ${token.accessToken}`,
      },
    }).then(async (resp) => {
      if (!resp.ok) {
        const err = await resp.json();
        setError(err.title);
        return;
      }
      setQuotes(await resp.json() as unknown as Quote[]);
    })
      .catch(err => {
        console.error(err)
        setError(err.title);
      });
  }

  const getTags = () => {
    setError("");
    setSuccess("");
    fetch("http://localhost:5146/api/VTags")
      .then(async (resp) => {
        if (!resp.ok) {
          const err = await resp.json();
          setError(err.title);
          return;
        }
        setTags(await resp.json() as unknown as Tag[]);
      })
      .catch(err => console.error(err));
  }

  const removeQuote = (id: string) => {
    setError("");
    setSuccess("");
    if (!token) {
      setError("Not logged in");
      return;
    }
    fetch(`http://localhost:5146/api/Quotes/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `${token.tokenType} ${token.accessToken}`,
      },
    }).then(async resp => {
      if (!resp.ok) {
        const err = await resp.json();
        setError(err.title);
        return
      }
      setQuotes((prevQuotes) => prevQuotes.filter(q => q.quoteId.toString() !== id));
      setSuccess("Quote removed");
    }).catch(err => {
      console.error(err);
      setError(err.title);
    });
  }

  const addQuote = (text: string) => {
    setError("");
    setSuccess("");
    if (!token) {
      setError("Not logged in");
      return;
    }
    if (!text) {
      setError("Quote cannot be empty");
      return;
    }
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
      if (!resp.ok) {
        const err = await resp.json();
        setError(err.title);
        return;
      }
      quote = await resp.json() as unknown as Quote;
      setQuotes((prevQuotes) => [...prevQuotes, quote]);
      setSuccess("Quote added");
    }).catch(err => {
      console.error(err);
      setError(err.title);
    })
  };

  const addTagToQuote = (quoteId: string, tagId: number) => {
    setError("");
    setSuccess("");
    if (!token) {
      setError("Not logged in");
      return;
    }

    fetch(`http://localhost:5146/api/Quotes/${quoteId}/tags/${tagId}`, {
      method: "POST",
      headers: {
        "Authorization": `${token.tokenType} ${token.accessToken}`,
      },
    }).then(async (resp) => {
      if (!resp.ok) {
        const err = await resp.json();
        setError(err.title);
        return;
      }
      setSuccess("Tag added to quote");
    }).catch(err => {
      console.error(err);
      setError(err.title);
    });
  }

  const addTag = (text: string) => {
    setError("");
    setSuccess("");
    if (!token) {
      setError("Not logged in");
      return;
    }
    if (!text) {
      setError("Tag cannot be empty");
      return;
    }
    let tag: Tag = {
      id: 0, type: 0,
      text: text,
    }

    fetch("http://localhost:5146/api/VTags", {
      method: "POST",
      body: JSON.stringify(tag),
      headers: {
        "Authorization": `${token.tokenType} ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    }).then(async (resp) => {
      if (!resp.ok) {
        const err = await resp.json();
        setError(err.title);
        return;
      }
      tag = await resp.json() as unknown as Tag;
      setTags((prevTag) => [...prevTag, tag]);
      setSuccess("Tag added");
    }).catch(err => {
      console.error(err);
      setError(err.title);
    });
  }

  return (
    <ApiContext.Provider
      value={{
        randomQuote,
        quotes,
        tags,
        error,
        success,
        searchTag,
        isLoggedIn,
        addQuote,
        addTag,
        addTagToQuote,
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
