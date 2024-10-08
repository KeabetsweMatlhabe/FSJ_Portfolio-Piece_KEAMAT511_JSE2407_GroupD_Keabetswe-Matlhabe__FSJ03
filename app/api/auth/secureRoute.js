// pages/api/secureRoute.js
import { getAuth } from "firebase-admin/auth"; // Make sure you have firebase-admin installed

export default async function handler(req, res) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authorization.split("Bearer ")[1];
  
  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    // Your secure logic here (using decodedToken)
    res.status(200).json({ message: "Secure data", uid: decodedToken.uid });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}
