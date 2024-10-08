// app/_app.js
import { AuthProvider } from '../context/authContext'; // Adjust the path as necessary

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
