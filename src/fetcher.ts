import axios from "axios";
import * as zod from "zod";

const postSchema = zod.object({
  id: zod.number(),
  userId: zod.number(),
  title: zod.string(),
  body: zod.string(),
});

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

type ParserReult<T> =
  | { success: false; error: zod.ZodError }
  | { success: true; data: T };

export type Post = zod.infer<typeof postSchema>;
export type User = zod.infer<typeof userSchema>;

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

export const getPosts = () =>
  retriveData<Post>(
    "https://jsonplaceholder.typicode.com/posts",
    postSchema.safeParse
  );

export const getUsers = () =>
  retriveData<User>(
    "https://jsonplaceholder.typicode.com/users",
    userSchema.safeParse
  );
