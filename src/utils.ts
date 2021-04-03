import { Post, User } from "./fetcher";

export const findTitleDuplicates = (posts: Post[]): string[] => {
  const duplicates: string[] = [];
  const alreadyUsed: Set<string> = new Set<string>();
  for (const p of posts) {
    if (alreadyUsed.has(p.title)) {
      duplicates.push(p.title);
    } else {
      alreadyUsed.add(p.title);
    }
  }
  return duplicates;
};

const countPostsByUsers = (posts: Post[]): Map<number, number> => {
  const counter: Map<number, number> = new Map<number, number>();
  for (const p of posts) {
    counter.set(p.userId, (counter.get(p.userId) || 0) + 1);
  }
  return counter;
};

const mapUsersById = (users: User[]) =>
  users.reduce((map, u) => {
    map.set(u.id, u);
    return map;
  }, new Map<number, User>());

export const descriptiveCountPostByUsers = (posts: Post[], users: User[]) => {
  const usersMap = mapUsersById(users);
  const postsCounter = countPostsByUsers(posts);
  const result: string[] = [];
  for (const [userId, count] of postsCounter) {
    const name = usersMap.get(userId)?.name || "Anonim";
    result.push(`${name} napisał(a) ${count} postów`);
  }
  return result;
};
