import "./globals.css";
import { AuthProvider } from '../context/authContext'; 

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
      >
        {children}
      </body>
      <AuthProvider>
      {children}
    </AuthProvider>
    </html>
  );
}
