import { getPosts, getUsers } from "./fetcher";
import { descriptiveCountPostByUsers, findTitleDuplicates } from "./utils";

const main = async () => {
  const posts = await getPosts();
  const users = await getUsers();
  console.log(descriptiveCountPostByUsers(posts, users));
  console.log(findTitleDuplicates(posts));
};

main();
