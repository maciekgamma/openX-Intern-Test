import { getPosts, getUsers } from "../src/fetcher";

describe("external API tests", () => {
  it("recives posts from API", async () => {
    return getPosts().then((posts) => {
      expect(posts.length).toBeGreaterThan(0);
    });
  });

  it("recives users from API", async () => {
    return getUsers().then((users) => {
      expect(users.length).toBeGreaterThan(0);
    });
  });
});
