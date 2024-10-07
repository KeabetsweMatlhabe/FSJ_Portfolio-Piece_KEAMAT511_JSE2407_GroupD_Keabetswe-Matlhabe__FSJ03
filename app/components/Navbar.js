
import { useAuth } from "../context/authContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav>
      {user ? (
        <>
          <span>Welcome, {user.email}</span>
          <button onClick={logout}>Sign Out</button>
        </>
      ) : (
        <a href="/auth/signin">Sign In</a>
      )}
    </nav>
  );
}
