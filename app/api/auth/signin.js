// SignIn.js

import { useState } from "react";
import { signIn } from "../path/to/auth"; // Adjust the path accordingly

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const user = await signIn(email, password);
      console.log("User signed in:", user);
      // Redirect or perform additional actions here
    } catch (err) {
      setError("Failed to sign in. Please check your credentials.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Sign In</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default SignIn;
