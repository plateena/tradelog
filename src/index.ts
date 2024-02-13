import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000; // Port for Express server

// Define routes
app.get('/', (req, res) => {
  res.send('API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
