import axios from "axios";
import * as zod from "zod";

/**
 * Schema of Post object for zod parser
 */
const postSchema = zod.object({
  id: zod.number(),
  userId: zod.number(),
  title: zod.string(),
  body: zod.string(),
});

/**
 * Schema of User object for zod parser
 */
const userSchema = zod.object({
  id: zod.number(),
  name: zod.string(),
  username: zod.string(),
  email: zod.string(),
  address: zod.object({
    street: zod.string(),
    suite: zod.string(),
    city: zod.string(),
    zipcode: zod.string(),
    geo: zod.object({
      lat: zod.string(),
      lng: zod.string(),
    }),
  }),
  phone: zod.string(),
  website: zod.string(),
  company: zod.object({
    name: zod.string(),
    catchPhrase: zod.string(),
    bs: zod.string(),
  }),
});

/**
 * Type of a Post object generated using it's schema with zod
 */
export type Post = zod.infer<typeof postSchema>;
/**
 * Type of a User object generated using it's schema with zod
 */
export type User = zod.infer<typeof userSchema>;

type ParserReult<T> =
  | { success: false; error: zod.ZodError }
  | { success: true; data: T };

/**
 * Makes a request to an API and parses the data
 * @template T targeted type of parser
 * @param url url of the API endpoint (response must contain `data` field in form of array)
 * @param parse function that parses data to the tageted type (function returns `ParserResult<T>`
 * with `success` set to `True` means object was parsed and returned in `data` field and
 * `False` means object couldn't be parsed and gives error in `error` field)
 * @returns promise of an array of parsed objects
 */
const retriveData = <T>(url: string, parse: (x: any) => ParserReult<T>) => {
  return new Promise<T[]>((resolve, reject) => {
    axios
      .get(url)
      .then((res) => {
        const result: T[] = [];
        for (const rawData of res.data) {
          const parsed = parse(rawData);

          if (parsed.success) {
            result.push(parsed.data);
          }
        }
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Gets posts from API and parses them
 * @returns promis of array of Posts
 */
export const getPosts = () =>
  retriveData<Post>(
    "https://jsonplaceholder.typicode.com/posts",
    postSchema.safeParse
  );

/**
 * Gets users from API and parses them
 * @returns promise of array of Users
 */
export const getUsers = () =>
  retriveData<User>(
    "https://jsonplaceholder.typicode.com/users",
    userSchema.safeParse
  );
