const { validateId } = require("../../app/models/utils");

describe("validateId", () => {
  test("validateId resolves for valid ID", async () => {
    await expect(validateId(1)).resolves.toBeUndefined();
  });
  test("validateId rejects for invalid ID", async () => {
    await expect(validateId("abc")).rejects.toEqual({
      status: 400,
      msg: "invalid ID, must be a number",
    });
  });
});
