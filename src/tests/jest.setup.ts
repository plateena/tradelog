import dotenv from "dotenv"

// Load environment variables based on the environment
if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config();
}
