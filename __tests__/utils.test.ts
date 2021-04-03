import { descriptiveCountPostByUsers, findTitleDuplicates } from "../src/utils";
import { posts as mockPosts } from "./mockData/posts";
import { users as mockUsers } from "./mockData/users";

it("finds tititles duplicates", () => {
  const posts = mockPosts;
  expect(findTitleDuplicates(posts)).toEqual(["qui est esse"]);
});

it("counts posts by users", () => {
  const posts = mockPosts;
  const users = mockUsers;
  const result = descriptiveCountPostByUsers(posts, users);
  expect(result).toContainEqual("Leanne Graham napisał(a) 3 postów");
});

it("handles posts by unknow user", () => {
  const posts = mockPosts;
  posts[0].userId = -1;
  const users = mockUsers;
  const result = descriptiveCountPostByUsers(posts, users);
  expect(result).toContainEqual("Anonim napisał(a) 1 postów");
});
