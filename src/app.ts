import express from 'express';

const app = express();

// Define routes
app.get('/test-running', (req, res) => {
  res.send('API is running');
});

export default app;
