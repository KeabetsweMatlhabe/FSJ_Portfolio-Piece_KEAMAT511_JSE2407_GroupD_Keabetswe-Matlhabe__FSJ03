
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { useRouter } from "next/router";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter(); // For redirecting after sign-in

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      // Sign in user using Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get the Firebase Authentication token
      const token = await user.getIdToken();
      
      // Store the token in localStorage
      localStorage.setItem('token', token);
      
      // Redirect user to a protected page after successful sign-in
      router.push('/');
    } catch (err) {
      setError(err.message); // Set error if sign-in fails
    }
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSignIn}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Sign In</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
