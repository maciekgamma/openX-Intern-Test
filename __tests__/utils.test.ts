import {
  calculateDistance,
  descriptiveCountPostByUsers,
  findNearestUsers,
  findTitleDuplicates,
  makeProfiles,
} from "../src/utils";
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
  expect(result).toContainEqual("Leanne Graham napisał(a) 2 postów");
});

it("handles posts by unknow user", () => {
  const posts = mockPosts;
  const users = mockUsers;
  const result = descriptiveCountPostByUsers(posts, users);
  expect(result).toContainEqual("Anonim napisał(a) 1 postów");
});

it("calculates distance between locations", () => {
  expect(calculateDistance(50.07653, 19.94605, 50.0629, 19.93388)).toBeCloseTo(
    1.751
  );
});

it("finds the nearest user", () => {
  const users = mockUsers;
  const nearest = findNearestUsers(users);
  expect(nearest.get(users[0])?.id).toBe(3);
});

it("generates profiles", () => {
  const posts = mockPosts;
  const users = mockUsers;
  expect(makeProfiles(posts, users)).toContainEqual({
    user: users[0],
    posts: [posts[3], posts[4]],
  });
});
