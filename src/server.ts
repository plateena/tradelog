import buildApp from './app'

const PORT = process.env.PORT || 3000; // Port for Express server
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
