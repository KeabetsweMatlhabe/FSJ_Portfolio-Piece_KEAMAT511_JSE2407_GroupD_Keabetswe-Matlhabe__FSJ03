
export default function handler(req, res) {
  if (req.method === 'GET') {
    
    // List of categories. This can be replaced with categories fetched from Firestore if necessary.
    const categories = [
      { id: 'electronics', name: 'Electronics' },
      { id: 'fashion', name: 'Fashion' },
    ];
    
    res.status(200).json(categories);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
