import server from '../index'; // Import server from index.ts

afterAll(done => {
  server.close(done);
});
