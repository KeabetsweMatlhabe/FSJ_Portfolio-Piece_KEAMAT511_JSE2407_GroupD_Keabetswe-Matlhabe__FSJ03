
// import admin from "firebase-admin";

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert({
//       projectId: process.env.FIREBASE_PROJECT_ID,
//       clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//       privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
//     }),
//   });
// }

// export default async function handler(req, res) {
//   const { token } = req.body;

//   if (!token) {
//     return res.status(400).json({ message: "Token is required" });
//   }

//   try {
//     const decodedToken = await admin.auth().verifyIdToken(token);
//     return res.status(200).json({ decodedToken });
//   } catch (error) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// }
