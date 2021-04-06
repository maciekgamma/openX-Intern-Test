import { Post, User } from "./fetcher";

/**
 * Finds titles that are used more than once in posts
 * @param posts array of posts to search for duplicated titles
 * @returns array of titles that are duplicates
 */
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

/**
 *  Counts how many posts have benn written by each user
 * @param posts array of posts
 * @returns map of user's IDs and how many post have been written by this user
 */
const countPostsByUsers = (posts: Post[]): Map<number, number> => {
  const counter: Map<number, number> = new Map<number, number>();
  for (const p of posts) {
    counter.set(p.userId, (counter.get(p.userId) || 0) + 1);
  }
  return counter;
};

/**
 *  Maps user's ID to it's object (User)
 * @param users array of users to be maped
 * @returns map of ID's and user with that id
 */
const mapUsersById = (users: User[]) =>
  users.reduce((map, u) => {
    map.set(u.id, u);
    return map;
  }, new Map<number, User>());

/**
 * Counts how many posts have benn written by each user and presets it in text form:
 * "{Username} napisał(a) {count} postów."
 * @param posts array of posts
 * @param users array of users
 * @returns array of strings, one for each user (and additional Anonymous one if there was a post written by unknow user)
 */
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

/**
 * Calculates distance betwwen two locations usign Haversine Formula
 * @param lat1 latitude of first location
 * @param lng1 longtitude of first location
 * @param lat2 latitude of second location
 * @param lng2 longtitude of second location
 * @returns distsance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) => {
  const R = 6371;
  /**
   * Converts number to radians
   * @param x number to convert
   * @returns converted number in radians
   */
  const toRad = (x: number) => (x * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 *  Calculates distance between two users
 * @param a first user
 * @param b second user
 * @returns distsance in kilometers
 */
const calculateDistanceistanceBetweenUsers = (a: User, b: User) =>
  calculateDistance(
    parseFloat(a.address.geo.lat),
    parseFloat(a.address.geo.lng),
    parseFloat(b.address.geo.lat),
    parseFloat(b.address.geo.lng)
  );

/**
 * Finnds a nearest other user (different ID) to a given user
 * @param user user that's neighbour we search for
 * @param all array of all users (can contain the given user)
 * @returns the closest other user or Undefined if can't find any other user
 */
const findNearestUser = (user: User, all: User[]) => {
  let minDist = Number.POSITIVE_INFINITY;
  let closest: User | undefined = undefined;
  for (const other of all) {
    if (user.id !== other.id) {
      const dist = calculateDistanceistanceBetweenUsers(user, other);
      if (dist < minDist) {
        minDist = dist;
        closest = other;
      }
    }
  }
  return closest;
};

/**
 * Finds nearest other user of each user
 * @param users array of users
 * @returns map of users and it's closest neighbour
 */
export const findNearestUsers = (users: User[]) => {
  const closestUsers: Map<User, User> = new Map<User, User>();
  for (const u of users) {
    const nearest = findNearestUser(u, users);
    if (nearest) {
      closestUsers.set(u, nearest);
    }
  }
  return closestUsers;
};

/**
 * Profile is an object that combines the data about user and all it's posts
 */
interface Profile {
  user: User;
  posts: Post[];
}

/**
 *  Generates profiles from user and post arrays
 * @param posts array of all posts
 * @param users array of all users
 * @returns array of profiles
 */
export const makeProfiles = (posts: Post[], users: User[]): Profile[] => {
  const profilesMap: Map<number, Profile> = users.reduce((map, user) => {
    map.set(user.id, { user, posts: [] });
    return map;
  }, new Map<number, Profile>());
  for (const p of posts) {
    profilesMap.get(p.userId)?.posts.push(p);
  }
  return Array.from(profilesMap.values());
};
