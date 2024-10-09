// pages/api/auth.js
import { auth } from '../../firebaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Missing token' });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    const { uid, email } = decodedToken;

    return res.status(200).json({ user: { uid, email } });
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
}