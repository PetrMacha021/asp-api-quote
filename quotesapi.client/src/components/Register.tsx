import { useApiContext } from "../providers/ApiProvider";
import { useState } from "react";

export default function Register() {
  const context = useApiContext();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <div>
        <label htmlFor={"username"}>Username</label>
        <input id="username" type="text" value={username} onChange={event => setUsername(event.target.value)}
               placeholder={"Username"}/>
      </div>
      <div>
        <label htmlFor={"password"}>Password</label>
        <input id="password" type="password" value={password} onChange={event => setPassword(event.target.value)}
               placeholder={"Password"}/>
      </div>
      <button type="submit" onClick={() => context.register(username, password)}>Register</button>
    </div>
  )
}
