import db from "./../database"

/**
 * @group db
 */

describe("DB", () => {

    afterAll(() => {
        db.close()
    })

    it("can connect to database", async () => {
        await db.connect()
        expect(db.getConnection().readyState).toBe(1)
    }, 20000);
});
