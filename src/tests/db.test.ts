import db from '../db';

describe('Database Connection', () => {
  it('should successfully connect to the database', async () => {
    // Check if the database connection is open
    expect(db.readyState).toBe(1); // 1 means connected
  });
});
