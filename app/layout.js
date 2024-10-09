// app/layout.js
import { AuthProvider } from '../context/authContext';  // Ensure the path is correct
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </AuthProvider>
  );
}
